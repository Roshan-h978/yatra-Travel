from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Sum

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from bookings.models import Booking
from drivers.models import Driver
from packages_app.models import Package
from vehicles.models import Vehicle

from .models import SupportMessage


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_analytics(request):

    # One query for every booking number. Only confirmed bookings count as revenue.
    bookings = Booking.objects.aggregate(
        total=Count('id'),
        pending=Count('id', filter=Q(status='Pending')),
        approved=Count('id', filter=Q(status='Approved')),
        rejected=Count('id', filter=Q(status='Rejected')),
        completed=Count('id', filter=Q(status='Completed')),
        cancelled=Count('id', filter=Q(status='Cancelled')),
        revenue=Sum('total_price', filter=Q(status__in=['Approved', 'Completed'])),
    )

    vehicles = Vehicle.objects.aggregate(
        total=Count('id'),
        available=Count('id', filter=Q(status='Available')),
    )

    return Response({

        "total_bookings": bookings['total'],

        "total_vehicles": vehicles['total'],

        "available_vehicles": vehicles['available'],

        "total_packages": Package.objects.count(),

        "total_drivers": Driver.objects.count(),

        "total_customers": get_user_model().objects.filter(is_staff=False).count(),

        "total_revenue": bookings['revenue'] or 0,

        "pending_bookings": bookings['pending'],

        "approved_bookings": bookings['approved'],

        "rejected_bookings": bookings['rejected'],

        "completed_bookings": bookings['completed'],

        "cancelled_bookings": bookings['cancelled'],

        "pending_support": SupportMessage.objects.filter(status='Pending').count(),

    })
