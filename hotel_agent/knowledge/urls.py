from django.urls import path
from .views import (
    test_retrieval,
    search_hotels,
    search_indian_hotels,
    hotel_ai_assistant,
    booking_availability,
    booking_create,
    list_bookings,
    support_tickets,
    staff_dashboard_api,
    lead_capture,
    seed_inventory,
)

app_name = "knowledge_api"

urlpatterns = [
    path("test-retrieval/", test_retrieval, name="test_retrieval"),
    path("hotels/", search_hotels, name="search_hotels"),
    path("indian-hotels/", search_indian_hotels, name="search_indian_hotels"),
    path("ai-assistant/", hotel_ai_assistant, name="hotel_ai_assistant"),
    path("booking/availability/", booking_availability, name="booking_availability"),
    path("booking/create/", booking_create, name="booking_create"),
    path("bookings/", list_bookings, name="list_bookings"),
    path("support-tickets/", support_tickets, name="support_tickets"),
    path("staff-dashboard/", staff_dashboard_api, name="staff_dashboard_api"),
    path("leads/create/", lead_capture, name="lead_capture"),
    path("demo/seed-inventory/", seed_inventory, name="seed_inventory"),
]
