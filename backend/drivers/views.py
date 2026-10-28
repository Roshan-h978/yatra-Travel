from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Driver
from .serializers import DriverSerializer


# =========================
# GET DRIVERS
# =========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_drivers(request):

    drivers = Driver.objects.all().order_by('-id')

    serializer = DriverSerializer(
        drivers,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)


# =========================
# GET DRIVER DETAIL
# =========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_driver(request, id):

    driver = get_object_or_404(Driver, id=id)

    serializer = DriverSerializer(
        driver,
        context={'request': request}
    )

    return Response(serializer.data)


# =========================
# ADD DRIVER
# =========================

@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_driver(request):

    serializer = DriverSerializer(
        data=request.data,
        context={'request': request}
    )

    if serializer.is_valid():

        serializer.save()

        return Response({"message": "Driver Added Successfully"})

    return Response(serializer.errors, status=400)


# =========================
# UPDATE DRIVER
# =========================

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_driver(request, id):

    driver = get_object_or_404(Driver, id=id)

    serializer = DriverSerializer(
        driver,
        data=request.data,
        partial=True,
        context={'request': request}
    )

    if serializer.is_valid():

        serializer.save()

        return Response({"message": "Driver Updated Successfully"})

    return Response(serializer.errors, status=400)


# =========================
# DELETE DRIVER
# =========================

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_driver(request, id):

    driver = get_object_or_404(Driver, id=id)

    driver.delete()

    return Response({"message": "Driver Deleted Successfully"})
