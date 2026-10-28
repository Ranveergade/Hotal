
from django.db import models


class HotelKnowledge(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    content = models.TextField()

    def __str__(self):
        return self.title

class HotelListing(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    location = models.CharField(max_length=255, blank=True)
    rating = models.CharField(max_length=50, blank=True)
    review_score = models.CharField(max_length=50, blank=True)
    room_type = models.CharField(max_length=255, blank=True)
    bed_type = models.CharField(max_length=255, blank=True)
    price_original = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.name} - {self.room_type}"


class RoomReview(models.Model):
    property_name = models.CharField(max_length=255, db_index=True)
    price_original = models.CharField(max_length=100, blank=True)
    review_count = models.IntegerField(default=0)
    comment = models.TextField(blank=True)

    def __str__(self):
        return self.property_name


class BookingRecord(models.Model):
    hotel = models.CharField(max_length=100, db_index=True)
    is_canceled = models.BooleanField(default=False)
    arrival_year = models.IntegerField(null=True, blank=True)
    arrival_month = models.CharField(max_length=30, blank=True)
    adults = models.IntegerField(default=0)
    children = models.FloatField(default=0)
    country = models.CharField(max_length=10, blank=True)
    reserved_room_type = models.CharField(max_length=10, blank=True)
    adr = models.FloatField(default=0)
    reservation_status = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.hotel} - {self.reservation_status}"


class HotelFAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=100, default="general")
    language = models.CharField(max_length=20, default="en")
    source = models.CharField(max_length=100, default="demo")
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.question[:100]


class GuestIntentExample(models.Model):
    instruction = models.TextField()
    intent = models.CharField(max_length=100, db_index=True)
    category = models.CharField(max_length=100, db_index=True)
    tags = models.CharField(max_length=255, blank=True)
    response = models.TextField()

    def __str__(self):
        return f"{self.intent}: {self.instruction[:80]}"


class IndianHotel(models.Model):
    property_id = models.CharField(max_length=100, blank=True, db_index=True)
    name = models.CharField(max_length=255, db_index=True)
    city = models.CharField(max_length=100, blank=True, db_index=True)
    state = models.CharField(max_length=100, blank=True, db_index=True)
    address = models.TextField(blank=True)
    locality = models.CharField(max_length=255, blank=True)
    hotel_type = models.CharField(max_length=100, blank=True)
    star_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    review_rating = models.FloatField(null=True, blank=True)
    review_count = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    facilities = models.TextField(blank=True)
    room_type = models.TextField(blank=True)
    room_facilities = models.TextField(blank=True)
    checkin_checkout_policy = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - {self.city}"
