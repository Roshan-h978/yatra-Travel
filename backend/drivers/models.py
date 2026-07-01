from django.db import models


class Driver(models.Model):

    STATUS_CHOICES = [

        ('Available','Available'),

        ('On Trip','On Trip'),

        ('Unavailable','Unavailable'),

    ]

    full_name = models.CharField(
        max_length=200
    )

    phone = models.CharField(
        max_length=30
    )

    email = models.EmailField()

    license_number = models.CharField(
        max_length=200
    )

    experience_years = models.IntegerField()

    address = models.TextField()

    image = models.ImageField(
        upload_to='drivers/',
        blank=True,
        null=True
    )

    status = models.CharField(

        max_length=100,

        choices=STATUS_CHOICES,

        default='Available'

    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.full_name