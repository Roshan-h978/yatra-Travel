from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import Booking

from .serializers import BookingSerializer
from services.email_utils import send_booking_email


# =========================
# GET BOOKINGS
# =========================

@api_view(['GET'])

def get_bookings(request):

    bookings = Booking.objects.all().order_by('-id')

    serializer = BookingSerializer(

        bookings,

        many=True

    )

    return Response(serializer.data)


# =========================
# CREATE BOOKING
# =========================

@api_view(['POST'])

def create_booking(request):

    serializer = BookingSerializer(

        data=request.data

    )

    if serializer.is_valid():

        booking = serializer.save()

        # SEND EMAIL

        send_booking_email(

            booking.email,

            booking.full_name,

            "Pending"

        )

        return Response({

            "message":
            "Booking Created Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )

    serializer = BookingSerializer(

        data=request.data

    )

    if serializer.is_valid():

        serializer.save()

        return Response({

            "message":
            "Booking Created Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# UPDATE BOOKING STATUS
# =========================

@api_view(['PUT'])

def update_booking_status(request,id):

    booking = Booking.objects.get(id=id)

    status = request.data.get("status")

    booking.status = status

    booking.save()

    # SEND EMAIL

    send_booking_email(

        booking.email,

        booking.full_name,

        booking.status

    )

    return Response({

        "message":
        "Booking Updated Successfully"

    })

    booking = Booking.objects.get(id=id)

    status = request.data.get("status")

    booking.status = status

    booking.save()

    return Response({

        "message":
        "Booking Updated Successfully"

    })


# =========================
# DELETE BOOKING
# =========================

@api_view(['DELETE'])

def delete_booking(request,id):

    booking = Booking.objects.get(id=id)

    booking.delete()

    return Response({

        "message":
        "Booking Deleted Successfully"

    })