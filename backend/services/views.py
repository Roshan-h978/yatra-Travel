from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import BooleanField, ValidationError

from .models import Review, SupportMessage
from .serializers import ReviewSerializer, SupportMessageSerializer
from .email_utils import send_support_reply_email


# =========================
# GET SUPPORT MESSAGES (ADMIN)
# =========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_support_messages(request):

    messages = SupportMessage.objects.all().order_by('-id')

    serializer = SupportMessageSerializer(messages, many=True)

    return Response(serializer.data)


# =========================
# CREATE SUPPORT MESSAGE (PUBLIC)
# =========================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_support_message(request):

    serializer = SupportMessageSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save()

        return Response({"message": "Support Message Sent"}, status=201)

    return Response(serializer.errors, status=400)


# =========================
# REPLY SUPPORT MESSAGE (ADMIN)
# =========================

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def reply_support_message(request, id):

    support = get_object_or_404(SupportMessage, id=id)

    reply = str(request.data.get("admin_reply", "")).strip()

    if not reply:

        return Response({"error": "Reply cannot be empty"}, status=400)

    support.admin_reply = reply
    support.status = "Replied"
    support.save()

    send_support_reply_email(
        support.email,
        support.customer_name,
        reply
    )

    return Response({"message": "Reply Sent Successfully"})


# =========================
# CLOSE SUPPORT MESSAGE (ADMIN)
# =========================

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def close_support_message(request, id):

    support = get_object_or_404(SupportMessage, id=id)

    support.status = "Closed"
    support.save()

    return Response({"message": "Message Closed"})


# =========================
# DELETE MESSAGE (ADMIN)
# =========================

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_support_message(request, id):

    support = get_object_or_404(SupportMessage, id=id)

    support.delete()

    return Response({"message": "Message Deleted"})


# =========================
# REVIEWS
# =========================
# Public sees approved reviews; logged-in customers submit;
# admins see everything and approve / delete.

@api_view(['GET'])
@permission_classes([AllowAny])
def get_reviews(request):

    reviews = Review.objects.filter(is_approved=True).select_related('user').order_by('-id')

    return Response(ReviewSerializer(reviews, many=True).data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_reviews(request):

    reviews = Review.objects.select_related('user').order_by('-id')

    return Response(ReviewSerializer(reviews, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_reviews(request):

    reviews = Review.objects.filter(user=request.user).select_related('user').order_by('-id')

    return Response(ReviewSerializer(reviews, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):

    serializer = ReviewSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(user=request.user)

        return Response({"message": "Thanks! Your review is awaiting approval."}, status=201)

    return Response(serializer.errors, status=400)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_review(request, id):

    review = get_object_or_404(Review, id=id)

    if "is_approved" not in request.data:

        return Response({"error": "is_approved is required"}, status=400)

    try:

        # Accepts true/false, "true"/"false", 1/0 from JSON or form data.
        review.is_approved = BooleanField().to_internal_value(request.data["is_approved"])

    except ValidationError:

        return Response({"error": "is_approved must be true or false"}, status=400)

    review.save()

    return Response({"message": "Review Updated"})


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_review(request, id):

    review = get_object_or_404(Review, id=id)

    review.delete()

    return Response({"message": "Review Deleted"})
