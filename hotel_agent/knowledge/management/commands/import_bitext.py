
import csv
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from knowledge.models import GuestIntentExample


class Command(BaseCommand):
    help = "Import Bitext hospitality intent examples."

    def handle(self, *args, **options):
        path = (
            Path(settings.BASE_DIR)
            / "data"
            / "bitext-hospitality-llm-chatbot-training-dataset.csv"
        )

        if not path.exists():
            raise CommandError(f"Dataset not found: {path}")

        self.stdout.write("Reading Bitext dataset...")

        batch = []
        total = 0

        with path.open("r", encoding="latin1", newline="") as file:
            reader = csv.DictReader(file)

            required = {
                "instruction", "intent", "category", "tags", "response"
            }
            if not required.issubset(set(reader.fieldnames or [])):
                raise CommandError(
                    f"Unexpected columns: {reader.fieldnames}"
                )

            with transaction.atomic():
                # Replace previously imported Bitext examples only.
                GuestIntentExample.objects.all().delete()

                for row in reader:
                    instruction = (row.get("instruction") or "").strip()
                    intent = (row.get("intent") or "").strip()
                    category = (row.get("category") or "").strip()

                    if not instruction or not intent or not category:
                        continue

                    batch.append(GuestIntentExample(
                        instruction=instruction,
                        intent=intent,
                        category=category,
                        tags=(row.get("tags") or "").strip(),
                        response=(row.get("response") or "").strip(),
                    ))

                    if len(batch) >= 1000:
                        GuestIntentExample.objects.bulk_create(
                            batch, batch_size=1000
                        )
                        total += len(batch)
                        batch = []

                if batch:
                    GuestIntentExample.objects.bulk_create(
                        batch, batch_size=1000
                    )
                    total += len(batch)

        self.stdout.write(self.style.SUCCESS(
            f"Imported {total} Bitext examples."
        ))
