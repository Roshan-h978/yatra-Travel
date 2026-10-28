from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from drivers.models import Driver
from vehicles.models import Vehicle

from .models import Booking

from .serializers import BookingSerializer, has_overlap
from services.email_utils import send_booking_email


# Which status an admin may move a booking to from its current status.
ALLOWED_TRANSITIONS = {
    "Pending": {"Approved", "Rejected"},
    "Approved": {"Completed", "Rejected"},
    "Rejected": {"Pending"},
    "Completed": set(),
    "Cancelled": set(),
}

ACTIVE_STATUSES = ["Pending", "Approved"]


def calculate_total_price(vehicle, package, pickup_date, return_date):

    days = (return_date - pickup_date).days + 1

    total = 0

    if vehicle:
        total += vehicle.price_per_day * days

    if package:
        total += package.price

    return total


def sync_vehicle_status(vehicle):

    """Booked while any approved booking exists, otherwise Available.
    Vehicles in Maintenance are left alone."""

    if vehicle is None or vehicle.status == "Maintenance":
        return

    new_status = (
        "Booked"
        if vehicle.booking_set.filter(status="Approved").exists()
        else "Available"
    )

    if vehicle.status != new_status:
        vehicle.status = new_status
        vehicle.save(update_fields=["status"])


def customer_email(booking):

    # Emails go to the account owner, not a free-typed address.
    return booking.user.email or booking.email


# =========================
# GET ALL BOOKINGS (ADMIN)
# =========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_bookings(request):

    bookings = Booking.objects.select_related(
        'vehicle', 'package', 'driver'
    ).order_by('-id')

    serializer = BookingSerializer(bookings, many=True)

    return Response(serializer.data)


# =========================
# GET MY BOOKINGS
# =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_bookings(request):

    bookings = Booking.objects.filter(
        user=request.user
    ).select_related('vehicle', 'package', 'driver').order_by('-id')

    serializer = BookingSerializer(bookings, many=True)

    return Response(serializer.data)


# =========================
# CREATE BOOKING
# =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):

    with transaction.atomic():

        # Lock the vehicle row so two requests can't both pass the overlap check.
        # (Row locks take effect on PostgreSQL; SQLite locks the whole database anyway.)
        vehicle_id = str(request.data.get("vehicle") or "")

        if vehicle_id.isdigit():
            list(Vehicle.objects.select_for_update().filter(pk=int(vehicle_id)))

        serializer = BookingSerializer(data=request.data)

        if not serializer.is_valid():

            return Response(serializer.errors, status=400)

        data = serializer.validated_data

        booking = serializer.save(
            user=request.user,
            total_price=calculate_total_price(
                data.get("vehicle"),
                data.get("package"),
                data["pickup_date"],
                data["return_date"],
            )
        )

    # SEND EMAIL

    send_booking_email(
        customer_email(booking),
        booking.full_name,
        "Pending"
    )

    return Response({
        "message": "Booking Created Successfully",
        "booking": BookingSerializer(booking).data
    }, status=201)


# =========================
# CANCEL MY BOOKING (CUSTOMER)
# =========================
# Customers may cancel their own Pending / Approved booking until the pickup date.

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_my_booking(request, id):

    booking = get_object_or_404(Booking, id=id, user=request.user)

    if booking.status not in ("Pending", "Approved"):

        return Response({"error": f"A {booking.status.lower()} booking cannot be cancelled."}, status=400)

    if booking.pickup_date <= timezone.localdate():

        return Response({"error": "This trip has already started. Please contact support to make changes."}, status=400)

    booking.status = "Cancelled"
    booking.save(update_fields=["status", "updated_at"])

    sync_vehicle_status(booking.vehicle)

    send_booking_email(customer_email(booking), booking.full_name, "Cancelled")

    return Response({
        "message": "Booking cancelled.",
        "booking": BookingSerializer(booking).data
    })


# =========================
# UPDATE BOOKING (ADMIN)
# =========================
# Accepts "status" and/or "driver" (driver id, or null to unassign).

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_booking_status(request, id):

    booking = get_object_or_404(Booking, id=id)

    status = request.data.get("status")

    status_changed = False

    if status is not None and status != booking.status:

        if not isinstance(status, str) or status not in dict(Booking.STATUS_CHOICES):

            return Response({"error": "Invalid status"}, status=400)

        if status not in ALLOWED_TRANSITIONS[booking.status]:

            return Response(
                {"error": f"A {booking.status} booking cannot be changed to {status}."},
                status=400
            )

        # Re-opening or approving must not clash with another active booking.
        if status in ("Approved", "Pending") and booking.vehicle:

            if status == "Approved" and booking.vehicle.status == "Maintenance":

                return Response({"error": "This vehicle is under maintenance."}, status=400)

            if has_overlap(booking.vehicle, booking.pickup_date, booking.return_date, exclude_id=booking.id):

                return Response(
                    {"error": "Another active booking already uses this vehicle on these dates."},
                    status=400
                )

        booking.status = status

        status_changed = True

    if "driver" in request.data:

        driver_id = request.data.get("driver")

        if driver_id in (None, ""):

            booking.driver = None

        else:

            try:

                driver_id = int(driver_id)

            except (TypeError, ValueError):

                return Response({"error": "Invalid driver"}, status=400)

            booking.driver = get_object_or_404(Driver, id=driver_id)

    booking.save()

    if status_changed:

        sync_vehicle_status(booking.vehicle)

        # SEND EMAIL

        send_booking_email(
            customer_email(booking),
            booking.full_name,
            booking.status
        )

    return Response({
        "message": "Booking Updated Successfully",
        "booking": BookingSerializer(booking).data
    })


# =========================
# DELETE BOOKING (ADMIN)
# =========================

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_booking(request, id):

    booking = get_object_or_404(Booking, id=id)

    vehicle = booking.vehicle

    booking.delete()

    sync_vehicle_status(vehicle)

    return Response({"message": "Booking Deleted Successfully"})
