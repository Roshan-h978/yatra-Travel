from django.db import models

class Vehicle(models.Model):

    VEHICLE_TYPE = [

        ('SUV','SUV'),
        ('Luxury','Luxury'),
        ('Jeep','Jeep'),
        ('Bike','Bike'),

    ]

    RENTAL_TYPE = [

        ('Self Drive','Self Drive'),
        ('With Driver','With Driver'),

    ]

    STATUS_CHOICES = [

        ('Available','Available'),
        ('Booked','Booked'),
        ('Maintenance','Maintenance'),

    ]

    name = models.CharField(
        max_length=200
    )

    brand = models.CharField(
        max_length=200
    )

    price_per_day = models.IntegerField()

    vehicle_type = models.CharField(
        max_length=100,
        choices=VEHICLE_TYPE
    )

    rental_type = models.CharField(
        max_length=100,
        choices=RENTAL_TYPE
    )

    seats = models.IntegerField()

    transmission = models.CharField(
        max_length=100
    )

    fuel_type = models.CharField(
        max_length=100
    )

    description = models.TextField()

    image = models.ImageField(
        upload_to='vehicles/',
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

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.name