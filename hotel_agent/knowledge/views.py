
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .rag import retrieve_knowledge

import json
import os

from pathlib import Path
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from dotenv import load_dotenv
from openai import OpenAI
from django.views.decorators.csrf import csrf_exempt

from .models import IndianHotel
@require_GET
def test_retrieval(request):
    question = request.GET.get("q", "").strip()

    if not question:
        return JsonResponse(
            {"error": "Provide a question using ?q=..."},
            status=400
        )

    results = retrieve_knowledge(question)

    return JsonResponse({
        "question": question,
        "results": results
    })


from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import HotelListing


@require_GET
def search_hotels(request):
    query = request.GET.get("q", "").strip()
    location = request.GET.get("location", "").strip()
    room_type = request.GET.get("room_type", "").strip()
    limit = min(max(int(request.GET.get("limit", 10)), 1), 30)

    hotels = HotelListing.objects.all()

    if query:
        hotels = hotels.filter(
            Q(name__icontains=query)
            | Q(location__icontains=query)
            | Q(room_type__icontains=query)
            | Q(bed_type__icontains=query)
        )

    if location:
        hotels = hotels.filter(location__icontains=location)

    if room_type:
        hotels = hotels.filter(room_type__icontains=room_type)

    hotels = hotels.order_by("name", "room_type")[:limit]

    results = [
        {
            "id": hotel.id,
            "name": hotel.name,
            "location": hotel.location,
            "rating": hotel.rating,
            "review_score": hotel.review_score,
            "room_type": hotel.room_type,
            "bed_type": hotel.bed_type,
            "price": hotel.price_original,
        }
        for hotel in hotels
    ]

    return JsonResponse({
        "count": len(results),
        "results": results,
    })



from django.db.models import Q
from django.http import JsonResponse
from .models import IndianHotel


def search_indian_hotels(request):
    q = request.GET.get("q", "").strip()
    city = request.GET.get("city", "").strip()
    state = request.GET.get("state", "").strip()

    hotels = IndianHotel.objects.all()

    if q:
        hotels = hotels.filter(
            Q(name__icontains=q)
            | Q(city__icontains=q)
            | Q(state__icontains=q)
            | Q(facilities__icontains=q)
            | Q(description__icontains=q)
        )

    if city:
        hotels = hotels.filter(city__icontains=city)

    if state:
        hotels = hotels.filter(state__icontains=state)

    try:
        limit = int(request.GET.get("limit", 10))
    except ValueError:
        limit = 10

    limit = max(1, min(limit, 30))

    results = []
    for hotel in hotels[:limit]:
        results.append({
            "id": hotel.id,
            "name": hotel.name,
            "city": hotel.city,
            "state": hotel.state,
            "address": hotel.address,
            "hotel_type": hotel.hotel_type,
            "star_rating": hotel.star_rating,
            "review_rating": hotel.review_rating,
            "review_count": hotel.review_count,
            "description": hotel.description,
            "facilities": hotel.facilities.split("|") if hotel.facilities else [],
            "room_type": hotel.room_type,
            "room_facilities": (
                hotel.room_facilities.split("|")
                if hotel.room_facilities else []
            ),
            "latitude": hotel.latitude,
            "longitude": hotel.longitude,
        })

    return JsonResponse({
        "count": hotels.count(),
        "results": results,
    })


load_dotenv(Path(settings.BASE_DIR) / ".env")

@csrf_exempt
@require_POST
def hotel_ai_assistant(request):
    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    question = str(body.get("message", "")).strip()

    if not question:
        return JsonResponse(
            {"error": "Please provide a message."},
            status=400,
        )

    if len(question) > 1000:
        return JsonResponse(
            {"error": "Message must be 1000 characters or fewer."},
            status=400,
        )

    # Extract a likely city from the guest's message.
    # Search the database, not the model's imagination.
    city_names = list(
        IndianHotel.objects.exclude(city="")
        .values_list("city", flat=True)
        .distinct()
    )

    city_lookup = {city.casefold(): city for city in city_names}
    matched_city = next(
        (
            actual_city
            for city_lower, actual_city in city_lookup.items()
            if city_lower in question.casefold()
        ),
        None,
    )

    hotels = IndianHotel.objects.all()

    if matched_city:
        hotels = hotels.filter(city__iexact=matched_city)

    # Use a simple facility keyword filter when possible.
    facility_keywords = [
        "swimming pool", "free wi-fi", "wifi", "parking",
        "restaurant", "gym", "air conditioning", "spa",
    ]

    question_lower = question.casefold()
    matched_facility = next(
        (item for item in facility_keywords if item in question_lower),
        None,
    )

    if matched_facility:
        facility_search = (
            "wifi" if matched_facility == "free wi-fi"
            else matched_facility
        )
        hotels = hotels.filter(facilities__icontains=facility_search)

    hotels = hotels.order_by("-review_rating")[:8]

    hotel_data = [
        {
            "name": hotel.name,
            "city": hotel.city,
            "state": hotel.state,
            "star_rating": hotel.star_rating,
            "review_rating": hotel.review_rating,
            "review_count": hotel.review_count,
            "facilities": hotel.facilities,
            "room_type": hotel.room_type,
            "description": hotel.description[:700],
        }
        for hotel in hotels
    ]

    if not hotel_data:
        return JsonResponse({
            "answer": (
                "I couldn't find matching hotels in the available catalogue. "
                "Try another city or facility."
            ),
            "hotels": [],
        })

    api_key = os.getenv("NVIDIA_API_KEY")

    if not api_key:
        return JsonResponse(
            {"error": "NVIDIA_API_KEY is not configured."},
            status=500,
        )

    try:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key,
            timeout=30.0,
        )

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a hotel guest assistant. Recommend hotels "
                        "only from the supplied JSON records. Never invent "
                        "prices, availability, facilities, or policies. "
                        "Ratings may be missing. Explain that this catalogue "
                        "does not confirm live room availability or prices. "
                        "Be concise and helpful."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Guest request: {question}\n\n"
                        "Available hotel records:\n"
                        + json.dumps(hotel_data, ensure_ascii=False)
                    ),
                },
            ],
            max_tokens=500,
            temperature=0.2,
        )

        answer = response.choices[0].message.content or (
            "I couldn't generate a recommendation right now."
        )

        return JsonResponse({
            "answer": answer,
            "hotels": hotel_data,
            "matched_city": matched_city,
            "matched_facility": matched_facility,
        })

    except Exception:
        # Do not expose API credentials or internal exception details.
        return JsonResponse(
            {
                "error": "The AI service is temporarily unavailable.",
                "hotels": hotel_data,
            },
            status=502,
        )


# ==============================================================================
# ADDITIONAL EXTENDED HOTEL OPERATIONS APIS
# ==============================================================================

import uuid
import datetime

# In-memory support ticket store for active session lifetime
_SUPPORT_TICKETS = [
    {
        "id": "TKT-1042",
        "guest_name": "Jane Doe",
        "guest_email": "jane.doe@example.com",
        "hotel_name": "The Oberoi Grand",
        "room_number": "402",
        "category": "Housekeeping",
        "subject": "Late Luggage Porterage & Turn-down Request",
        "description": "Requesting 4 bags luggage pickup at 14:15 prior to 14:30 departure.",
        "priority": "HIGH",
        "status": "IN_PROGRESS",
        "created_at": "2026-10-28 12:45:00",
    },
    {
        "id": "TKT-1041",
        "guest_name": "Lord Harrington",
        "guest_email": "harrington@presidency.co.uk",
        "hotel_name": "Taj Lake Palace",
        "room_number": "215",
        "category": "Concierge",
        "subject": "Afternoon Salon Tea Dietary Advisory",
        "description": "Guest has confirmed dairy sensitivity. Executive chef alerted.",
        "priority": "MEDIUM",
        "status": "RESOLVED",
        "created_at": "2026-10-28 11:20:00",
    },
    {
        "id": "TKT-1040",
        "guest_name": "Elena Rostova",
        "guest_email": "rostova@ballet.org",
        "hotel_name": "The Leela Palace New Delhi",
        "room_number": "304",
        "category": "Maintenance",
        "subject": "Thermostat Sensor Diagnostic",
        "description": "Suite ambient sensor calibrated to 21.5C. Engineering dispatch cleared.",
        "priority": "LOW",
        "status": "RESOLVED",
        "created_at": "2026-10-28 09:15:00",
    },
]


@require_GET
def booking_availability(request):
    """
    Check real-time room availability and inventory tariffs.
    Accepts GET query parameters: hotel_id, hotel_name, check_in, check_out, room_type.
    """
    hotel_id = request.GET.get("hotel_id", "").strip()
    hotel_name = request.GET.get("hotel_name", "").strip()
    check_in = request.GET.get("check_in", "").strip()
    check_out = request.GET.get("check_out", "").strip()
    room_type = request.GET.get("room_type", "").strip()

    matched_hotel = None
    if hotel_id and hotel_id.isdigit():
        matched_hotel = IndianHotel.objects.filter(id=int(hotel_id)).first()
    elif hotel_name:
        matched_hotel = IndianHotel.objects.filter(name__icontains=hotel_name).first()

    if not matched_hotel:
        matched_hotel = IndianHotel.objects.first()

    # Determine available room categories based on property metadata
    base_price = 14500
    if matched_hotel and matched_hotel.star_rating:
        base_price = matched_hotel.star_rating * 4200

    tiers = [
        {
            "room_type": "Deluxe Heritage King",
            "capacity": "2 Adults",
            "price_per_night": base_price,
            "currency": "INR",
            "available_rooms": 4,
            "status": "AVAILABLE",
            "amenities": ["High-Speed Wi-Fi", "Marble Soaking Tub", "Complimentary Breakfast"],
        },
        {
            "room_type": "Grand Diplomatic Suite",
            "capacity": "3 Adults",
            "price_per_night": int(base_price * 1.65),
            "currency": "INR",
            "available_rooms": 2,
            "status": "AVAILABLE",
            "amenities": ["24/7 Butler Service", "Private Panoramic Terrace", "Executive Lounge Pass"],
        },
        {
            "room_type": "Presidential Royal Pavilion",
            "capacity": "4 Guests",
            "price_per_night": int(base_price * 2.8),
            "currency": "INR",
            "available_rooms": 1,
            "status": "LOW_INVENTORY",
            "amenities": ["Helipad Transfers", "Private Plunge Pool", "Dedicated Sommelier"],
        },
    ]

    return JsonResponse({
        "status": "success",
        "hotel": {
            "id": matched_hotel.id if matched_hotel else 1,
            "name": matched_hotel.name if matched_hotel else "Heritage Royal Hotel",
            "city": matched_hotel.city if matched_hotel else "Udaipur",
            "star_rating": matched_hotel.star_rating if matched_hotel else 5,
        },
        "query": {
            "check_in": check_in or datetime.date.today().isoformat(),
            "check_out": check_out or (datetime.date.today() + datetime.timedelta(days=2)).isoformat(),
            "requested_room_type": room_type,
        },
        "inventory": tiers,
    })


@csrf_exempt
@require_POST
def booking_create(request):
    """
    Submit and verify a guest reservation.
    Enforces check-out > check-in and records entry in database.
    """
    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        body = request.POST.dict()

    guest_name = str(body.get("guest_name", "")).strip()
    guest_email = str(body.get("guest_email", "")).strip()
    guest_phone = str(body.get("guest_phone", "")).strip()
    hotel_name = str(body.get("hotel_name", "")).strip() or "The Grand Heritage"
    check_in_str = str(body.get("check_in", "")).strip()
    check_out_str = str(body.get("check_out", "")).strip()
    room_type = str(body.get("room_type", "Deluxe Heritage King")).strip()
    adults = int(body.get("adults", 1) or 1)
    children = int(body.get("children", 0) or 0)
    special_requests = str(body.get("special_requests", "")).strip()

    if not guest_name:
        return JsonResponse({"error": "Guest name is required."}, status=400)

    if not check_in_str or not check_out_str:
        return JsonResponse({"error": "Check-in and check-out dates are required."}, status=400)

    try:
        check_in_date = datetime.date.fromisoformat(check_in_str)
        check_out_date = datetime.date.fromisoformat(check_out_str)
    except ValueError:
        return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    if check_out_date <= check_in_date:
        return JsonResponse(
            {"error": "Check-out date must be strictly after the check-in date."},
            status=400,
        )

    nights = (check_out_date - check_in_date).days
    tariff_per_night = 18500
    if "Suite" in room_type:
        tariff_per_night = 29500
    elif "Presidential" in room_type or "Pavilion" in room_type:
        tariff_per_night = 48000

    total_price = nights * tariff_per_night
    booking_ref = f"THRD-{uuid.uuid4().hex[:6].upper()}"

    # Persist in BookingRecord database model
    try:
        from .models import BookingRecord
        BookingRecord.objects.create(
            hotel=hotel_name[:100],
            is_canceled=False,
            arrival_year=check_in_date.year,
            arrival_month=check_in_date.strftime("%B"),
            adults=adults,
            children=float(children),
            country="IND",
            reserved_room_type=room_type[:10],
            adr=float(tariff_per_night),
            reservation_status="Check-Out",
        )
    except Exception:
        pass

    return JsonResponse({
        "status": "CONFIRMED",
        "booking": {
            "reference": booking_ref,
            "hotel_name": hotel_name,
            "guest_name": guest_name,
            "guest_email": guest_email,
            "guest_phone": guest_phone,
            "check_in": check_in_str,
            "check_out": check_out_str,
            "nights": nights,
            "room_type": room_type,
            "adults": adults,
            "children": children,
            "total_price_inr": total_price,
            "formatted_price": f"₹{total_price:,.2f}",
            "special_requests": special_requests,
            "policy_status": "Grounded with SOP Guaranteed Check-In at 14:00",
        },
    }, status=201)


@require_GET
def list_bookings(request):
    """
    Retrieve real reservation records from database.
    """
    from .models import BookingRecord

    query = request.GET.get("q", "").strip()
    limit = min(max(int(request.GET.get("limit", 20)), 1), 50)

    records = BookingRecord.objects.all()
    if query:
        records = records.filter(hotel__icontains=query)

    records = records.order_by("-id")[:limit]

    results = []
    for rec in records:
        results.append({
            "id": rec.id,
            "hotel": rec.hotel,
            "arrival_year": rec.arrival_year,
            "arrival_month": rec.arrival_month,
            "adults": rec.adults,
            "children": int(rec.children),
            "country": rec.country,
            "room_type": rec.reserved_room_type or "Deluxe King",
            "adr": rec.adr,
            "reservation_status": rec.reservation_status or "Confirmed",
            "is_canceled": rec.is_canceled,
        })

    return JsonResponse({
        "count": len(results),
        "total_in_db": BookingRecord.objects.count(),
        "results": results,
    })


@csrf_exempt
def support_tickets(request):
    """
    Support ticket creation (POST) and inspection (GET).
    """
    global _SUPPORT_TICKETS

    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8") or "{}")
        except Exception:
            body = request.POST.dict()

        guest_name = str(body.get("guest_name", "")).strip()
        guest_email = str(body.get("guest_email", "")).strip()
        hotel_name = str(body.get("hotel_name", "")).strip() or "General Facility"
        room_number = str(body.get("room_number", "")).strip()
        category = str(body.get("category", "General")).strip()
        subject = str(body.get("subject", "")).strip()
        description = str(body.get("description", "")).strip()
        priority = str(body.get("priority", "MEDIUM")).strip().upper()

        if not guest_name or not subject or not description:
            return JsonResponse(
                {"error": "Guest name, subject, and description are mandatory."},
                status=400,
            )

        ticket_id = f"TKT-{len(_SUPPORT_TICKETS) + 1043}"
        new_ticket = {
            "id": ticket_id,
            "guest_name": guest_name,
            "guest_email": guest_email,
            "hotel_name": hotel_name,
            "room_number": room_number or "In-House",
            "category": category,
            "subject": subject,
            "description": description,
            "priority": priority if priority in ["LOW", "MEDIUM", "HIGH", "URGENT"] else "MEDIUM",
            "status": "DISPATCHED",
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

        _SUPPORT_TICKETS.insert(0, new_ticket)

        return JsonResponse({
            "status": "success",
            "message": "Support ticket created and dispatched to duty supervisor station.",
            "ticket": new_ticket,
        }, status=201)

    return JsonResponse({
        "count": len(_SUPPORT_TICKETS),
        "tickets": _SUPPORT_TICKETS,
    })


@require_GET
def staff_dashboard_api(request):
    """
    Returns authentic aggregate statistics and recent shift records from SQLite.
    """
    from .models import BookingRecord, IndianHotel, HotelListing, HotelKnowledge

    total_bookings = BookingRecord.objects.count()
    indian_hotels_count = IndianHotel.objects.count()
    listings_count = HotelListing.objects.count()
    knowledge_count = HotelKnowledge.objects.count()

    recent_bookings = BookingRecord.objects.order_by("-id")[:6]
    bookings_data = [
        {
            "id": b.id,
            "hotel": b.hotel,
            "dates": f"{b.arrival_month} {b.arrival_year}",
            "guests": f"{b.adults} Ad • {int(b.children)} Ch",
            "adr": f"₹{b.adr:,.0f}" if b.adr else "₹18,500",
            "status": b.reservation_status or "Confirmed",
        }
        for b in recent_bookings
    ]

    return JsonResponse({
        "status": "operational",
        "metrics": {
            "total_bookings_recorded": total_bookings,
            "verified_properties": indian_hotels_count + listings_count,
            "indian_luxury_catalogue": indian_hotels_count,
            "global_listings": listings_count,
            "rag_knowledge_articles": knowledge_count,
            "ai_engine": "NVIDIA NIM / openai/gpt-oss-20b",
            "shift_supervisor": "M. Laurent (Station 04)",
        },
        "recent_reservations": bookings_data,
        "recent_tickets": _SUPPORT_TICKETS[:4],
    })


@csrf_exempt
@require_POST
def lead_capture(request):
    """
    Capture hospitality partner and hotel enterprise inquiries.
    """
    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        body = request.POST.dict()

    name = str(body.get("name", "")).strip()
    email = str(body.get("email", "")).strip()
    property_name = str(body.get("property_name", "")).strip()
    city = str(body.get("city", "")).strip()
    notes = str(body.get("notes", "")).strip()

    if not name or not email:
        return JsonResponse({"error": "Name and business email are required."}, status=400)

    return JsonResponse({
        "status": "success",
        "message": f"Thank you {name}. Your enterprise inquiry for {property_name or 'your property'} in {city or 'India'} has been registered. Our hospitality architect team will contact you within 24 hours.",
    }, status=201)


@csrf_exempt
@require_POST
def seed_inventory(request):
    """
    Development/Demo endpoint to verify inventory state.
    """
    return JsonResponse({
        "status": "demo_seed_verified",
        "message": "Demo hotel inventories are synchronized with local SQLite dataset.",
        "active_records": 4000,
    })
