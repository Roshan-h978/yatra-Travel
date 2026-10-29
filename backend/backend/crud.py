"""Shared list / detail / add / update / delete API views and URLs.

Vehicles, packages and drivers all expose the same five endpoints:

    GET    ""                 list (newest first)
    GET    "<id>/"            detail
    POST   "add/"             create            (admin)
    PUT    "update/<id>/"     partial update    (admin)
    DELETE "delete/<id>/"     delete            (admin)
"""

from django.shortcuts import get_object_or_404
from django.urls import path

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from bookings.models import ACTIVE_STATUSES


def build_crud_views(model, serializer_class, label, *, public_read=False, protect_active_bookings=False):

    """Return (list, detail, add, update, delete) views for a model.

    public_read: anyone may list / view (otherwise admins only).
    protect_active_bookings: refuse to delete while Pending / Approved bookings use the item.
    """

    read_permission = AllowAny if public_read else IsAdminUser

    noun = label.lower()

    @api_view(['GET'])
    @permission_classes([read_permission])
    def list_view(request):

        objects = model.objects.all().order_by('-id')

        return Response(serializer_class(objects, many=True, context={'request': request}).data)

    @api_view(['GET'])
    @permission_classes([read_permission])
    def detail_view(request, id):

        obj = get_object_or_404(model, id=id)

        return Response(serializer_class(obj, context={'request': request}).data)

    @api_view(['POST'])
    @permission_classes([IsAdminUser])
    def add_view(request):

        serializer = serializer_class(data=request.data, context={'request': request})

        if serializer.is_valid():

            serializer.save()

            return Response({"message": f"{label} Added Successfully"})

        return Response(serializer.errors, status=400)

    @api_view(['PUT'])
    @permission_classes([IsAdminUser])
    def update_view(request, id):

        obj = get_object_or_404(model, id=id)

        serializer = serializer_class(obj, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():

            serializer.save()

            return Response({"message": f"{label} Updated Successfully"})

        return Response(serializer.errors, status=400)

    @api_view(['DELETE'])
    @permission_classes([IsAdminUser])
    def delete_view(request, id):

        obj = get_object_or_404(model, id=id)

        # Keep bookings intact: active bookings must be finished or rejected first.
        if protect_active_bookings and obj.booking_set.filter(status__in=ACTIVE_STATUSES).exists():

            return Response(
                {"error": f"This {noun} has pending or approved bookings. Reject or complete them first."},
                status=400
            )

        obj.delete()

        return Response({"message": f"{label} Deleted Successfully"})

    return list_view, detail_view, add_view, update_view, delete_view


def crud_urlpatterns(list_view, detail_view, add_view, update_view, delete_view):

    return [

        path("", list_view),

        path("<int:id>/", detail_view),

        path("add/", add_view),

        path("update/<int:id>/", update_view),

        path("delete/<int:id>/", delete_view),

    ]
