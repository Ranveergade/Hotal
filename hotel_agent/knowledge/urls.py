
from django.urls import path
from .views import test_retrieval,search_hotels,search_indian_hotels,hotel_ai_assistant

urlpatterns = [
    path("test-retrieval/", test_retrieval, name="test_retrieval"),
    path("hotels/", search_hotels, name="search_hotels"),
    path("indian-hotels/", search_indian_hotels, name="search_indian_hotels"),
    path("ai-assistant/", hotel_ai_assistant, name="hotel_ai_assistant"),
]
