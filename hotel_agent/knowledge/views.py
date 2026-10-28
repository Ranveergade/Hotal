
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
