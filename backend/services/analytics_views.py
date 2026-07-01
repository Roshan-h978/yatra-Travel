from rest_framework.decorators import api_view

from rest_framework.response import Response

from bookings.models import Booking

from vehicles.models import Vehicle

from packages_app.models import Package

from django.contrib.auth.models import User

from django.db.models import Sum


@api_view(['GET'])

def dashboard_analytics(request):

    total_bookings = Booking.objects.count()

    total_vehicles = Vehicle.objects.count()

    total_packages = Package.objects.count()

    total_customers = User.objects.count()

    revenue = Booking.objects.aggregate(

        total=Sum('total_price')

    )['total'] or 0

    approved_bookings = Booking.objects.filter(

        status='Approved'

    ).count()

    pending_bookings = Booking.objects.filter(

        status='Pending'

    ).count()

    completed_bookings = Booking.objects.filter(

        status='Completed'

    ).count()

    return Response({

        "total_bookings":
        total_bookings,

        "total_vehicles":
        total_vehicles,

        "total_packages":
        total_packages,

        "total_customers":
        total_customers,

        "total_revenue":
        revenue,

        "approved_bookings":
        approved_bookings,

        "pending_bookings":
        pending_bookings,

        "completed_bookings":
        completed_bookings

    })