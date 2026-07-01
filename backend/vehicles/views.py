from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import Vehicle

from .serializers import VehicleSerializer


# =========================
# GET VEHICLES
# =========================

@api_view(['GET'])

def get_vehicles(request):

    vehicles = Vehicle.objects.all().order_by('-id')

    serializer = VehicleSerializer(

        vehicles,

        many=True,

        context={

            'request': request

        }

    )

    return Response(serializer.data)


# =========================
# ADD VEHICLE
# =========================

@api_view(['POST'])

def add_vehicle(request):

    serializer = VehicleSerializer(

        data=request.data,

        context={

            'request': request

        }

    )

    if serializer.is_valid():

        serializer.save()

        return Response({

            "message":
            "Vehicle Added Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# UPDATE VEHICLE
# =========================

@api_view(['PUT'])

def update_vehicle(request,id):

    vehicle = Vehicle.objects.get(id=id)

    serializer = VehicleSerializer(

        vehicle,

        data=request.data,

        partial=True,

        context={

            'request': request

        }

    )

    if serializer.is_valid():

        serializer.save()

        return Response({

            "message":
            "Vehicle Updated Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# DELETE VEHICLE
# =========================

@api_view(['DELETE'])

def delete_vehicle(request,id):

    vehicle = Vehicle.objects.get(id=id)

    vehicle.delete()

    return Response({

        "message":
        "Vehicle Deleted Successfully"

    })