
from django.contrib import admin
from .models import HotelKnowledge


@admin.register(HotelKnowledge)
class HotelKnowledgeAdmin(admin.ModelAdmin):
    list_display = ("title", "category")
    search_fields = ("title", "content")
    list_filter = ("category",)

from .models import HotelFAQ

@admin.register(HotelFAQ)
class HotelFAQAdmin(admin.ModelAdmin):
    list_display = ("question", "category", "language", "is_verified")
    list_filter = ("category", "language", "is_verified")
    search_fields = ("question", "answer")