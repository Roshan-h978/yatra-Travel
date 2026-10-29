from django.utils import timezone

from rest_framework import serializers

from .models import ACTIVE_STATUSES, Booking


MAX_BOOKING_DAYS = 60


def has_overlap(vehicle, pickup, return_date, exclude_id=None):

    """True if another Pending/Approved booking uses this vehicle on overlapping dates."""

    qs = Booking.objects.filter(
        vehicle=vehicle,
        status__in=ACTIVE_STATUSES,
        pickup_date__lte=return_date,
        return_date__gte=pickup,
    )

    if exclude_id:
        qs = qs.exclude(id=exclude_id)

    return qs.exists()


class BookingSerializer(serializers.ModelSerializer):

    vehicle_name = serializers.CharField(
        source="vehicle.name",
        read_only=True,
        default=None
    )

    package_title = serializers.CharField(
        source="package.title",
        read_only=True,
        default=None
    )

    driver_name = serializers.CharField(
        source="driver.full_name",
        read_only=True,
        default=None
    )

    class Meta:

        model = Booking

        fields = "__all__"

        # Owner, price and status are set by the server, never by the customer.
        read_only_fields = [
            "user",
            "driver",
            "status",
            "total_price",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):

        vehicle = data.get("vehicle")
        package = data.get("package")
        pickup = data.get("pickup_date")
        return_date = data.get("return_date")

        if not vehicle and not package:

            raise serializers.ValidationError(
                "Select a vehicle or a package to book."
            )

        if pickup and pickup < timezone.localdate():

            raise serializers.ValidationError(
                "Pickup date cannot be in the past."
            )

        if pickup and return_date and return_date < pickup:

            raise serializers.ValidationError(
                "Return date must be on or after the pickup date."
            )

        if pickup and return_date and (return_date - pickup).days + 1 > MAX_BOOKING_DAYS:

            raise serializers.ValidationError(
                f"Bookings can be at most {MAX_BOOKING_DAYS} days long."
            )

        if vehicle:

            if vehicle.status == "Maintenance":

                raise serializers.ValidationError(
                    "This vehicle is under maintenance."
                )

            if has_overlap(vehicle, pickup, return_date):

                raise serializers.ValidationError(
                    "This vehicle is already booked for the selected dates."
                )

        return data
