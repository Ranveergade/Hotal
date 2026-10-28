
from django.contrib import admin
from .models import HotelKnowledge


@admin.register(HotelKnowledge)
class HotelKnowledgeAdmin(admin.ModelAdmin):
    list_display = ("title", "category")
    search_fields = ("title", "content")
    list_filter = ("category",)
