import logging

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Count
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import CustomerSerializer


User = get_user_model()

logger = logging.getLogger(__name__)


# =========================================
# GOOGLE AUTH IMPORTS
# =========================================

try:

    from google.oauth2 import id_token

    from google.auth.transport.requests import Request

except ImportError:

    id_token = None

    Request = None


# =========================================
# HELPERS
# =========================================

def get_tokens_for_user(user):

    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    }


def user_payload(user, **extra):

    return {
        "id": user.id,
        "name": user.first_name,
        "email": user.email,
        "username": user.username,
        "is_admin": user.is_staff,
        "is_superuser": user.is_superuser,
        "date_joined": user.date_joined,
        "has_password": user.has_usable_password(),
        **extra,
    }


def auth_response(user, message, **extra):

    update_last_login(None, user)

    tokens = get_tokens_for_user(user)

    return Response({
        "message": message,
        "access": tokens["access"],
        "refresh": tokens["refresh"],
        "user": user_payload(user, **extra),
    })


# =========================================
# REGISTER USER
# =========================================

class AuthRateThrottle(SimpleRateThrottle):

    # Limits login / register attempts per IP (rate: REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["auth"]).
    scope = "auth"

    def get_cache_key(self, request, view):

        return self.cache_format % {"scope": self.scope, "ident": self.get_ident(request)}


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AuthRateThrottle])
def register_user(request):

    data = request.data

    email = str(data.get("email", "")).strip().lower()

    password = str(data.get("password", ""))

    full_name = str(data.get("full_name", "")).strip()

    # =========================
    # VALIDATION
    # =========================

    if not email or not password:

        return Response({"error": "Email and Password are required"}, status=400)

    try:

        validate_email(email)

    except ValidationError:

        return Response({"error": "Enter a valid email address"}, status=400)

    if len(email) > 150:

        return Response({"error": "Email address is too long"}, status=400)

    # The email is also the username, so check both.
    if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username__iexact=email).exists():

        return Response({"error": "Email already exists"}, status=400)

    try:

        validate_password(password, User(username=email, email=email, first_name=full_name))

    except ValidationError as e:

        return Response({"error": " ".join(e.messages)}, status=400)

    # =========================
    # CREATE USER
    # =========================

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=full_name
    )

    return auth_response(user, "User Registered Successfully")


# =========================================
# LOGIN USER (EMAIL OR USERNAME)
# =========================================

@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AuthRateThrottle])
def login_user(request):

    login_input = str(request.data.get("login", "")).strip()

    password = str(request.data.get("password", ""))

    if not login_input or not password:

        return Response({"error": "Username and Password are required"}, status=400)

    user = authenticate(request, username=login_input, password=password)

    if not user:

        return Response({"error": "Invalid Username, Email or Password"}, status=401)

    return auth_response(user, "Login Successful")


# =========================================
# GOOGLE LOGIN
# =========================================

class GoogleLoginView(APIView):

    permission_classes = [AllowAny]

    throttle_classes = [AuthRateThrottle]

    def post(self, request):

        token = request.data.get("token")

        if not token:

            return Response({"error": "Google token missing"}, status=400)

        if id_token is None or Request is None:

            return Response({"error": "Google login is not available on the server"}, status=500)

        try:

            user_data = id_token.verify_oauth2_token(
                token,
                Request(),
                settings.GOOGLE_CLIENT_ID
            )

        except ValueError:

            logger.exception("Google token verification failed")

            return Response({"error": "Google sign-in failed. Please try again."}, status=400)

        email = str(user_data.get("email", "")).lower()

        if not email or not user_data.get("email_verified"):

            return Response({"error": "Your Google email is not verified"}, status=400)

        user = User.objects.filter(email__iexact=email).order_by("id").first()

        if user is None and User.objects.filter(username__iexact=email).exists():

            return Response({"error": "An account with this email already exists. Please log in with your password."}, status=400)

        if user is None:

            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=user_data.get("name", "")
            )

            user.set_unusable_password()
            user.save()

        if not user.is_active:

            return Response({"error": "Account Disabled"}, status=401)

        return auth_response(
            user,
            "Google Login Successful",
            picture=user_data.get("picture", "")
        )


# =========================================
# CURRENT USER
# =========================================

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def current_user(request):

    user = request.user

    if request.method == "PUT":

        name = str(request.data.get("name", "")).strip()

        if not name:

            return Response({"error": "Name cannot be empty"}, status=400)

        if len(name) > 150:

            return Response({"error": "Name is too long"}, status=400)

        user.first_name = name
        user.save(update_fields=["first_name"])

    return Response(user_payload(user))


# =========================================
# CHANGE PASSWORD
# =========================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@throttle_classes([AuthRateThrottle])
def change_password(request):

    user = request.user

    current = str(request.data.get("current_password", ""))

    new = str(request.data.get("new_password", ""))

    # Google-only accounts have no password yet, so they can set one without "current".
    if user.has_usable_password() and not user.check_password(current):

        return Response({"error": "Current password is incorrect"}, status=400)

    if current and current == new:

        return Response({"error": "New password must be different from the current one"}, status=400)

    try:

        validate_password(new, user)

    except ValidationError as e:

        return Response({"error": " ".join(e.messages)}, status=400)

    user.set_password(new)
    user.save(update_fields=["password"])

    return Response({"message": "Password updated successfully"})


# =========================================
# CUSTOMERS (ADMIN)
# =========================================

@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_customers(request):

    users = User.objects.annotate(
        booking_count=Count("booking")
    ).order_by("-date_joined")

    return Response(CustomerSerializer(users, many=True).data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def toggle_customer_active(request, id):

    user = get_object_or_404(User, id=id)

    if user == request.user:

        return Response({"error": "You cannot deactivate your own account"}, status=400)

    if (user.is_staff or user.is_superuser) and not request.user.is_superuser:

        return Response({"error": "Only a super administrator can change another admin's account."}, status=403)

    user.is_active = not user.is_active
    user.save(update_fields=["is_active"])

    return Response({
        "message": "Account Activated" if user.is_active else "Account Deactivated",
        "is_active": user.is_active
    })
