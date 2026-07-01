from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import SupportMessage

from .serializers import SupportMessageSerializer
from .email_utils import send_support_reply_email


# =========================
# GET SUPPORT MESSAGES
# =========================

@api_view(['GET'])

def get_support_messages(request):

    messages = SupportMessage.objects.all().order_by('-id')

    serializer = SupportMessageSerializer(

        messages,

        many=True

    )

    return Response(serializer.data)


# =========================
# CREATE SUPPORT MESSAGE
# =========================

@api_view(['POST'])

def create_support_message(request):

    serializer = SupportMessageSerializer(

        data=request.data

    )

    if serializer.is_valid():

        serializer.save()

        return Response({

            "message":
            "Support Message Sent"

        })

    return Response(

        serializer.errors,

        status=400

    )


# =========================
# REPLY SUPPORT MESSAGE
# =========================

@api_view(['PUT'])

def reply_support_message(request,id):

    support = SupportMessage.objects.get(id=id)

    reply = request.data.get(

        "admin_reply"

    )

    support.admin_reply = reply

    support.status = "Replied"

    support.save()

    # SEND EMAIL

    send_support_reply_email(

        support.email,

        support.customer_name,

        reply

    )

    return Response({

        "message":
        "Reply Sent Successfully"

    })

    support = SupportMessage.objects.get(id=id)

    support.admin_reply = request.data.get(

        "admin_reply"

    )

    support.status = "Replied"

    support.save()

    return Response({

        "message":
        "Reply Sent Successfully"

    })


# =========================
# DELETE MESSAGE
# =========================

@api_view(['DELETE'])

def delete_support_message(request,id):

    support = SupportMessage.objects.get(id=id)

    support.delete()

    return Response({

        "message":
        "Message Deleted"

    })