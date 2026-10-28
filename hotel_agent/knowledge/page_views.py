from django.shortcuts import render
from .models import IndianHotel, HotelListing, BookingRecord, HotelKnowledge
from .views import _SUPPORT_TICKETS

def landing_view(request):
    featured_hotels = IndianHotel.objects.filter(star_rating__gte=5)[:4]
    if not featured_hotels.exists():
        featured_hotels = IndianHotel.objects.all()[:4]

    context = {
        "page_title": "THREAD / HOTEL INTELLIGENCE — Autonomous Luxury Hospitality",
        "featured_hotels": featured_hotels,
        "total_hotels": IndianHotel.objects.count() + HotelListing.objects.count(),
        "total_bookings": BookingRecord.objects.count(),
        "knowledge_count": HotelKnowledge.objects.count(),
    }
    return render(request, "knowledge/landing.html", context)


def hotels_view(request):
    cities = (
        IndianHotel.objects.exclude(city="")
        .values_list("city", flat=True)
        .distinct()
        .order_by("city")[:25]
    )
    initial_hotels = IndianHotel.objects.order_by("-review_rating")[:12]

    context = {
        "page_title": "Curated Hotel Catalogue — THREAD",
        "cities": cities,
        "initial_hotels": initial_hotels,
        "total_hotels": IndianHotel.objects.count(),
    }
    return render(request, "knowledge/hotels.html", context)


def assistant_view(request):
    context = {
        "page_title": "AI Concierge — THREAD / HOTEL INTELLIGENCE",
        "sample_prompts": [
            "Luxury heritage hotels with private pool in Udaipur",
            "5-star sea view properties in Mumbai with butler service",
            "What is the standard checkout extension policy for VIP Centurion guests?",
            "Report air conditioning malfunction in Suite 402",
        ],
    }
    return render(request, "knowledge/assistant.html", context)


def booking_view(request):
    hotel_id = request.GET.get("hotel_id", "").strip()
    selected_hotel = None
    if hotel_id and hotel_id.isdigit():
        selected_hotel = IndianHotel.objects.filter(id=int(hotel_id)).first()

    available_hotels = IndianHotel.objects.filter(star_rating__gte=4).order_by("name")[:20]

    context = {
        "page_title": "Direct Booking Desk — THREAD",
        "selected_hotel": selected_hotel,
        "available_hotels": available_hotels,
    }
    return render(request, "knowledge/booking.html", context)


def bookings_view(request):
    recent_bookings = BookingRecord.objects.order_by("-id")[:40]
    context = {
        "page_title": "Guest Folio & Verified Reservations — THREAD",
        "bookings": recent_bookings,
        "total_count": BookingRecord.objects.count(),
    }
    return render(request, "knowledge/bookings.html", context)


def support_view(request):
    context = {
        "page_title": "Guest Services & Duty Escalation — THREAD",
        "categories": ["Housekeeping", "Luggage Porterage", "Engineering & Maintenance", "In-Room Dining", "Concierge", "Billing & Settlement"],
    }
    return render(request, "knowledge/support.html", context)


def staff_dashboard_view(request):
    total_bookings = BookingRecord.objects.count()
    indian_hotels = IndianHotel.objects.count()
    listings = HotelListing.objects.count()
    knowledge_count = HotelKnowledge.objects.count()
    recent_reservations = BookingRecord.objects.order_by("-id")[:10]

    context = {
        "page_title": "Staff Operations Supervision — THREAD",
        "total_bookings": total_bookings,
        "total_properties": indian_hotels + listings,
        "indian_catalogue": indian_hotels,
        "rag_articles": knowledge_count,
        "recent_reservations": recent_reservations,
        "recent_tickets": _SUPPORT_TICKETS,
    }
    return render(request, "knowledge/staff_dashboard.html", context)


def diagnostics_view(request):
    context = {
        "page_title": "RAG Retrieval Diagnostics — THREAD",
        "articles": HotelKnowledge.objects.all(),
    }
    return render(request, "knowledge/diagnostics.html", context)
