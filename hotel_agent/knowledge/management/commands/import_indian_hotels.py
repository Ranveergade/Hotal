
import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from knowledge.models import IndianHotel


class Command(BaseCommand):
    help = "Import Indian hotels from the Goibibo dataset"

    def handle(self, *args, **options):
        csv_path = (
            Path(__file__).resolve().parents[3]
            / "data"
            / "indian_hotels.csv"
        )

        if not csv_path.exists():
            self.stderr.write(
                self.style.ERROR(f"CSV not found: {csv_path}")
            )
            return

        hotels = []
        seen_ids = set()

        def clean(value):
            if value is None:
                return ""
            value = value.strip()
            return "" if value.lower() in {"nan", "none", "null"} else value

        def number(value):
            value = clean(value)
            if not value:
                return None
            try:
                return float(value)
            except (ValueError, TypeError):
                return None

        with open(csv_path, "r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)

            for row in reader:
                name = clean(row.get("property_name"))
                if not name:
                    continue

                property_id = clean(row.get("property_id"))

                if property_id and property_id in seen_ids:
                    continue
                if property_id:
                    seen_ids.add(property_id)

                rating = number(row.get("hotel_star_rating"))
                review_rating = number(row.get("site_review_rating"))
                review_count = number(row.get("site_review_count"))
                latitude = number(row.get("latitude"))
                longitude = number(row.get("longitude"))

                hotels.append(
                    IndianHotel(
                        property_id=property_id,
                        name=name,
                        city=clean(row.get("city")),
                        state=clean(row.get("state")),
                        address=clean(row.get("address")),
                        locality=clean(row.get("locality")),
                        hotel_type=clean(row.get("property_type")),
                        star_rating=(
                            int(rating)
                            if rating is not None and 1 <= rating <= 7
                            else None
                        ),
                        review_rating=(
                            review_rating
                            if review_rating is not None
                            and 0 <= review_rating <= 5
                            else None
                        ),
                        review_count=(
                            int(review_count)
                            if review_count is not None and review_count >= 0
                            else None
                        ),
                        description=clean(row.get("hotel_description")),
                        facilities=clean(row.get("hotel_facilities")),
                        room_type=clean(row.get("room_type")),
                        room_facilities=clean(row.get("room_facilities")),
                        checkin_checkout_policy=clean(
                            row.get("hotel_description")
                        ),
                        latitude=latitude,
                        longitude=longitude,
                    )
                )

        with transaction.atomic():
            # Replace only records imported into this Indian hotel catalogue.
            IndianHotel.objects.all().delete()

            for start in range(0, len(hotels), 500):
                IndianHotel.objects.bulk_create(hotels[start:start + 500])

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {len(hotels)} Indian hotels."
            )
        )
