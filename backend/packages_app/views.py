from rest_framework.decorators import api_view

from rest_framework.response import Response

from packages_app.models import Package

from .serializers import PackageSerializer


# =========================
# GET PACKAGES
# =========================

@api_view(['GET'])

def get_packages(request):

    packages = Package.objects.all().order_by('-id')

    serializer = PackageSerializer(

        packages,

        many=True,

        context={

            'request': request

        }

    )

    return Response(serializer.data)


# =========================
# ADD PACKAGE
# =========================

@api_view(['POST'])

def add_package(request):

    serializer = PackageSerializer(

        data=request.data,

        context={

            'request': request

        }

    )

    if serializer.is_valid():

        serializer.save()

        return Response({

            "message":
            "Package Added Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# UPDATE PACKAGE
# =========================

@api_view(['PUT'])

def update_package(request,id):

    package = Package.objects.get(id=id)

    serializer = PackageSerializer(

        package,

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
            "Package Updated Successfully"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# DELETE PACKAGE
# =========================

@api_view(['DELETE'])

def delete_package(request,id):

    package = Package.objects.get(id=id)

    package.delete()

    return Response({

        "message":
        "Package Deleted Successfully"

    })