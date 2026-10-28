from django.db import models

from django.conf import settings

from vehicles.models import Vehicle

from packages_app.models import Package

from drivers.models import Driver


class Booking(models.Model):

    STATUS_CHOICES = [

        ('Pending', 'Pending'),

        ('Approved', 'Approved'),

        ('Rejected', 'Rejected'),

        ('Completed', 'Completed'),

        ('Cancelled', 'Cancelled'),

    ]

    user = models.ForeignKey(

        settings.AUTH_USER_MODEL,

        on_delete=models.CASCADE

    )

    vehicle = models.ForeignKey(

        Vehicle,

        on_delete=models.SET_NULL,

        null=True,

        blank=True

    )

    package = models.ForeignKey(

        Package,

        on_delete=models.SET_NULL,

        null=True,

        blank=True

    )

    driver = models.ForeignKey(

        Driver,

        on_delete=models.SET_NULL,

        null=True,

        blank=True

    )

    full_name = models.CharField(
        max_length=200
    )

    email = models.EmailField()

    phone = models.CharField(
        max_length=30
    )

    pickup_date = models.DateField()

    return_date = models.DateField()

    total_price = models.IntegerField()

    special_request = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(

        max_length=100,

        choices=STATUS_CHOICES,

        default='Pending'

    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.full_name