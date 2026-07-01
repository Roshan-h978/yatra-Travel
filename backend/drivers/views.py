from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import Driver

from .serializers import DriverSerializer


# =========================
# GET DRIVERS
# =========================

@api_view(['GET'])

def get_drivers(request):

    drivers = Driver.objects.all().order_by('-id')

    serializer = DriverSerializer(

        drivers,

        many=True

    )

    return Response(serializer.data)


# =========================
# ADD DRIVER
# =========================

@api_view(['POST'])

def add_driver(request):

    serializer = DriverSerializer(

        data=request.data

    )

    if serializer.is_valid():

        serializer.save()

        return Response({

            "message":
            "Driver Added Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# UPDATE DRIVER STATUS
# =========================

@api_view(['PUT'])

def update_driver(request,id):

    driver = Driver.objects.get(id=id)

    serializer = DriverSerializer(

        driver,

        data=request.data,

        partial=True

    )

    if serializer.is_valid():

        serializer.save()

        return Response({

            "message":
            "Driver Updated Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# DELETE DRIVER
# =========================

@api_view(['DELETE'])

def delete_driver(request,id):

    driver = Driver.objects.get(id=id)

    driver.delete()

    return Response({

        "message":
        "Driver Deleted Successfully"

    })