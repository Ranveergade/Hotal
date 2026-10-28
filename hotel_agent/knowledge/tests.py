import json
import datetime
from django.test import TestCase, Client
from django.urls import reverse
from .models import IndianHotel, HotelListing, BookingRecord, HotelKnowledge

class ThreadHotelAgentTests(TestCase):
    def setUp(self):
        self.client = Client()
        # Seed test records
        self.hotel = IndianHotel.objects.create(
            name="The Grand Palace Udaipur",
            city="Udaipur",
            state="Rajasthan",
            star_rating=5,
            review_rating=4.8,
            description="Luxury palace stay with marble courts and infinity lake pool.",
            facilities="swimming pool|spa|wifi",
        )
        self.listing = HotelListing.objects.create(
            name="Grand Hotel Mumbai",
            location="Mumbai, Maharashtra",
            rating="5.0",
            price_original="₹22,000",
        )
        self.knowledge = HotelKnowledge.objects.create(
            title="Late Checkout SOP",
            category="Housekeeping",
            content="Complimentary late checkout until 14:00. Extension past 14:00 requires Duty Manager approval.",
        )
        self.booking = BookingRecord.objects.create(
            hotel="The Grand Palace Udaipur",
            arrival_year=2026,
            arrival_month="October",
            adults=2,
            children=0,
            reserved_room_type="Suite",
            adr=22000.0,
            reservation_status="Confirmed",
        )

    # --- Test Page Routes ---

    def test_landing_page(self):
        res = self.client.get(reverse("knowledge_pages:landing"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "THREAD")
        self.assertContains(res, "The Grand Palace Udaipur")

    def test_hotels_page(self):
        res = self.client.get(reverse("knowledge_pages:hotels"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "Hotel Directory")
        self.assertContains(res, "The Grand Palace Udaipur")

    def test_assistant_page(self):
        res = self.client.get(reverse("knowledge_pages:assistant"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "AI Concierge Terminal")

    def test_booking_page(self):
        res = self.client.get(reverse("knowledge_pages:booking"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "Hotel Booking Desk")

    def test_bookings_ledger_page(self):
        res = self.client.get(reverse("knowledge_pages:bookings"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "Verified Reservations")
        self.assertContains(res, "The Grand Palace Udaipur")

    def test_support_page(self):
        res = self.client.get(reverse("knowledge_pages:support"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "Human Escalation")

    def test_staff_dashboard_page(self):
        res = self.client.get(reverse("knowledge_pages:staff"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "Staff Operations Dashboard")

    def test_diagnostics_page(self):
        res = self.client.get(reverse("knowledge_pages:diagnostics"))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, "RAG Retrieval Diagnostics")

    # --- Test API Endpoints ---

    def test_api_indian_hotels(self):
        res = self.client.get(reverse("knowledge_api:search_indian_hotels"), {"q": "Udaipur"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["count"], 1)
        self.assertEqual(data["results"][0]["name"], "The Grand Palace Udaipur")

    def test_api_global_hotels(self):
        res = self.client.get(reverse("knowledge_api:search_hotels"), {"q": "Mumbai"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["count"], 1)

    def test_api_retrieval(self):
        res = self.client.get(reverse("knowledge_api:test_retrieval"), {"q": "late checkout policy"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("results", data)

    def test_api_booking_availability(self):
        res = self.client.get(reverse("knowledge_api:booking_availability"), {
            "hotel_id": self.hotel.id,
            "check_in": "2026-11-01",
            "check_out": "2026-11-03",
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("inventory", data)

    def test_api_booking_create_valid(self):
        payload = {
            "hotel_name": "The Grand Palace Udaipur",
            "guest_name": "Alexander Hayes",
            "guest_email": "hayes@centurion.com",
            "check_in": "2026-11-10",
            "check_out": "2026-11-13",
            "room_type": "Grand Diplomatic Suite",
            "adults": 2,
        }
        res = self.client.post(
            reverse("knowledge_api:booking_create"),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["status"], "CONFIRMED")
        self.assertTrue(data["booking"]["reference"].startswith("THRD-"))
        self.assertEqual(data["booking"]["nights"], 3)

    def test_api_booking_create_invalid_dates(self):
        # Check-out before or equal to check-in should fail
        payload = {
            "hotel_name": "The Grand Palace Udaipur",
            "guest_name": "Alexander Hayes",
            "check_in": "2026-11-10",
            "check_out": "2026-11-09",
        }
        res = self.client.post(
            reverse("knowledge_api:booking_create"),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertIn("error", data)

    def test_api_list_bookings(self):
        res = self.client.get(reverse("knowledge_api:list_bookings"))
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["count"], 1)

    def test_api_support_tickets_create_and_get(self):
        payload = {
            "guest_name": "Jane Doe",
            "guest_email": "jane@example.com",
            "hotel_name": "The Grand Palace Udaipur",
            "room_number": "Suite 402",
            "category": "Housekeeping",
            "subject": "Luggage porterage 4 bags",
            "description": "Please send porter at 14:15",
            "priority": "HIGH",
        }
        res = self.client.post(
            reverse("knowledge_api:support_tickets"),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertTrue(data["ticket"]["id"].startswith("TKT-"))

        # Verify GET returns tickets
        get_res = self.client.get(reverse("knowledge_api:support_tickets"))
        self.assertEqual(get_res.status_code, 200)
        self.assertGreaterEqual(get_res.json()["count"], 1)

    def test_api_staff_dashboard(self):
        res = self.client.get(reverse("knowledge_api:staff_dashboard_api"))
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "operational")
        self.assertIn("metrics", data)

    def test_api_lead_capture(self):
        payload = {
            "name": "Rajesh Singhania",
            "email": "rajesh@heritagegroup.in",
            "property_name": "Singhania Palace",
            "city": "Jodhpur",
            "notes": "120 rooms Opera PMS",
        }
        res = self.client.post(
            reverse("knowledge_api:lead_capture"),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["status"], "success")

    def test_api_seed_inventory(self):
        res = self.client.post(reverse("knowledge_api:seed_inventory"))
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "demo_seed_verified")
