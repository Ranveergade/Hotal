
from django.db import models


class HotelKnowledge(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    content = models.TextField()

    def __str__(self):
        return self.title
