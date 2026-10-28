from django.urls import path
from .page_views import (
    landing_view,
    hotels_view,
    assistant_view,
    booking_view,
    bookings_view,
    support_view,
    staff_dashboard_view,
    diagnostics_view,
)

app_name = "knowledge_pages"

urlpatterns = [
    path("", landing_view, name="landing"),
    path("hotels/", hotels_view, name="hotels"),
    path("assistant/", assistant_view, name="assistant"),
    path("booking/", booking_view, name="booking"),
    path("bookings/", bookings_view, name="bookings"),
    path("support/", support_view, name="support"),
    path("staff/", staff_dashboard_view, name="staff"),
    path("diagnostics/", diagnostics_view, name="diagnostics"),
]
