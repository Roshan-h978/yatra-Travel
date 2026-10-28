from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Package
from .serializers import PackageSerializer


# =========================
# GET PACKAGES
# =========================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_packages(request):

    packages = Package.objects.all().order_by('-id')

    serializer = PackageSerializer(
        packages,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)


# =========================
# GET PACKAGE DETAIL
# =========================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_package(request, id):

    package = get_object_or_404(Package, id=id)

    serializer = PackageSerializer(
        package,
        context={'request': request}
    )

    return Response(serializer.data)


# =========================
# ADD PACKAGE
# =========================

@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_package(request):

    serializer = PackageSerializer(
        data=request.data,
        context={'request': request}
    )

    if serializer.is_valid():

        serializer.save()

        return Response({"message": "Package Added Successfully"})

    return Response(serializer.errors, status=400)


# =========================
# UPDATE PACKAGE
# =========================

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_package(request, id):

    package = get_object_or_404(Package, id=id)

    serializer = PackageSerializer(
        package,
        data=request.data,
        partial=True,
        context={'request': request}
    )

    if serializer.is_valid():

        serializer.save()

        return Response({"message": "Package Updated Successfully"})

    return Response(serializer.errors, status=400)


# =========================
# DELETE PACKAGE
# =========================

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_package(request, id):

    package = get_object_or_404(Package, id=id)

    # Keep bookings intact: an active booking must be finished or rejected first.
    if package.booking_set.filter(status__in=["Pending", "Approved"]).exists():

        return Response(
            {"error": "This package has pending or approved bookings. Reject or complete them first."},
            status=400
        )

    package.delete()

    return Response({"message": "Package Deleted Successfully"})
