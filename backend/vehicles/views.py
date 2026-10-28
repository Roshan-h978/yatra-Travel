from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Vehicle
from .serializers import VehicleSerializer


# =========================
# GET VEHICLES
# =========================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_vehicles(request):

    vehicles = Vehicle.objects.all().order_by('-id')

    serializer = VehicleSerializer(
        vehicles,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)


# =========================
# GET VEHICLE DETAIL
# =========================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_vehicle(request, id):

    vehicle = get_object_or_404(Vehicle, id=id)

    serializer = VehicleSerializer(
        vehicle,
        context={'request': request}
    )

    return Response(serializer.data)


# =========================
# ADD VEHICLE
# =========================

@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_vehicle(request):

    serializer = VehicleSerializer(
        data=request.data,
        context={'request': request}
    )

    if serializer.is_valid():

        serializer.save()

        return Response({"message": "Vehicle Added Successfully"})

    return Response(serializer.errors, status=400)


# =========================
# UPDATE VEHICLE
# =========================

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_vehicle(request, id):

    vehicle = get_object_or_404(Vehicle, id=id)

    serializer = VehicleSerializer(
        vehicle,
        data=request.data,
        partial=True,
        context={'request': request}
    )

    if serializer.is_valid():

        serializer.save()

        return Response({"message": "Vehicle Updated Successfully"})

    return Response(serializer.errors, status=400)


# =========================
# DELETE VEHICLE
# =========================

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_vehicle(request, id):

    vehicle = get_object_or_404(Vehicle, id=id)

    # Keep bookings intact: an active booking must be finished or rejected first.
    if vehicle.booking_set.filter(status__in=["Pending", "Approved"]).exists():

        return Response(
            {"error": "This vehicle has pending or approved bookings. Reject or complete them first."},
            status=400
        )

    vehicle.delete()

    return Response({"message": "Vehicle Deleted Successfully"})
