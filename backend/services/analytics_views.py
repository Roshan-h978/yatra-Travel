from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from bookings.models import Booking
from vehicles.models import Vehicle
from packages_app.models import Package
from drivers.models import Driver
from services.models import SupportMessage

from django.contrib.auth import get_user_model
from django.db.models import Sum


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_analytics(request):

    User = get_user_model()

    # Only confirmed bookings count as revenue.
    revenue = Booking.objects.filter(
        status__in=['Approved', 'Completed']
    ).aggregate(total=Sum('total_price'))['total'] or 0

    return Response({

        "total_bookings": Booking.objects.count(),

        "total_vehicles": Vehicle.objects.count(),

        "available_vehicles": Vehicle.objects.filter(status='Available').count(),

        "total_packages": Package.objects.count(),

        "total_drivers": Driver.objects.count(),

        "total_customers": User.objects.filter(is_staff=False).count(),

        "total_revenue": revenue,

        "pending_bookings": Booking.objects.filter(status='Pending').count(),

        "approved_bookings": Booking.objects.filter(status='Approved').count(),

        "rejected_bookings": Booking.objects.filter(status='Rejected').count(),

        "completed_bookings": Booking.objects.filter(status='Completed').count(),

        "cancelled_bookings": Booking.objects.filter(status='Cancelled').count(),

        "pending_support": SupportMessage.objects.filter(status='Pending').count(),

    })
