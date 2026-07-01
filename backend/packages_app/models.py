from django.db import models


class Package(models.Model):

    title = models.CharField(
        max_length=200
    )

    location = models.CharField(
        max_length=200
    )

    duration = models.CharField(
        max_length=100
    )

    price = models.IntegerField()

    description = models.TextField()

    image = models.ImageField(
        upload_to='packages/',
        blank=True,
        null=True
    )

    rating = models.FloatField(
        default=5.0
    )

    is_featured = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.title