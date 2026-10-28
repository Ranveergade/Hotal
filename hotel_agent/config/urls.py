from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("knowledge.urls")),
    path("", include("knowledge.page_urls")),
]
