
import csv
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from knowledge.models import HotelListing, RoomReview, BookingRecord


def read_csv(filename):
    path = Path(settings.BASE_DIR) / "data" / filename

    if not path.exists():
        raise CommandError(f"File not found: {path}")

    with path.open("r", encoding="latin1", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Remove accidental whitespace from CSV headers.
            yield {
                (key or "").strip(): (value or "").strip()
                for key, value in row.items()
            }


def safe_int(value, default=0):
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return default


def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


class Command(BaseCommand):
    help = "Import the three hotel CSV datasets into Django."

    @transaction.atomic
    def handle(self, *args, **options):
        data_dir = Path(settings.BASE_DIR) / "data"

        required_files = [
            "booking_hotel.csv",
            "hotel_bookings.csv",
            "tripadvisor_room.csv",
        ]

        for filename in required_files:
            if not (data_dir / filename).exists():
                raise CommandError(f"Missing {data_dir / filename}")

        self.stdout.write("Importing hotel listings...")

        # These three tables are treated as imported dataset tables.
        # Existing rows in these tables will be replaced.
        HotelListing.objects.all().delete()
        RoomReview.objects.all().delete()
        BookingRecord.objects.all().delete()

        batch = []
        count = 0

        for row in read_csv("booking_hotel.csv"):
            name = row.get("Hotel Name", "")
            if not name:
                continue

            batch.append(HotelListing(
                name=name,
                location=row.get("Location", ""),
                rating=row.get("Rating", ""),
                review_score=row.get("Review Score", ""),
                room_type=row.get("Room Type", ""),
                bed_type=row.get("Bed Type", ""),
                price_original=row.get(
                    "Room Price (in BDTor any other currency)", ""
                ),
            ))

            if len(batch) >= 1000:
                HotelListing.objects.bulk_create(batch, batch_size=1000)
                count += len(batch)
                batch = []

        if batch:
            HotelListing.objects.bulk_create(batch, batch_size=1000)
            count += len(batch)

        self.stdout.write(self.style.SUCCESS(
            f"Imported {count} hotel listing rows."
        ))

        self.stdout.write("Importing room reviews...")

        batch = []
        count = 0

        for row in read_csv("tripadvisor_room.csv"):
            name = row.get("property name", "")
            if not name:
                continue

            batch.append(RoomReview(
                property_name=name,
                price_original=row.get(
                    "Room Price (in BDT or any other currency)", ""
                ),
                review_count=safe_int(row.get("review_count", 0)),
                comment=row.get("Comment about room", ""),
            ))

            if len(batch) >= 1000:
                RoomReview.objects.bulk_create(batch, batch_size=1000)
                count += len(batch)
                batch = []

        if batch:
            RoomReview.objects.bulk_create(batch, batch_size=1000)
            count += len(batch)

        self.stdout.write(self.style.SUCCESS(
            f"Imported {count} room review rows."
        ))

        self.stdout.write("Importing historical bookings...")

        batch = []
        count = 0

        for row in read_csv("hotel_bookings.csv"):
            batch.append(BookingRecord(
                hotel=row.get("hotel", ""),
                is_canceled=safe_int(row.get("is_canceled", 0)) == 1,
                arrival_year=(
                    safe_int(row["arrival_date_year"])
                    if row.get("arrival_date_year", "").strip()
                    else None
                ),
                arrival_month=row.get("arrival_date_month", ""),
                adults=safe_int(row.get("adults", 0)),
                children=safe_float(row.get("children", 0)),
                country=row.get("country", ""),
                reserved_room_type=row.get("reserved_room_type", ""),
                adr=safe_float(row.get("adr", 0)),
                reservation_status=row.get("reservation_status", ""),
            ))

            if len(batch) >= 1000:
                BookingRecord.objects.bulk_create(batch, batch_size=1000)
                count += len(batch)
                batch = []

        if batch:
            BookingRecord.objects.bulk_create(batch, batch_size=1000)
            count += len(batch)

        self.stdout.write(self.style.SUCCESS(
            f"Imported {count} historical booking rows."
        ))

        self.stdout.write(self.style.SUCCESS(
            "All three datasets imported successfully."
        ))
