from rest_framework.decorators import api_view

from rest_framework.response import Response

from rest_framework.views import APIView

from django.contrib.auth.models import User

from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken
import traceback


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
# GENERATE JWT TOKENS
# =========================================

def get_tokens_for_user(user):

    refresh = RefreshToken.for_user(user)

    return {

        "refresh": str(refresh),

        "access": str(refresh.access_token)

    }


# =========================================
# REGISTER USER
# =========================================

@api_view(["POST"])

def register_user(request):

    data = request.data

    email = str(

        data.get("email","")

    ).strip()

    password = str(

        data.get("password","")

    ).strip()

    full_name = str(

        data.get("full_name","")

    ).strip()

    # =========================
    # EMPTY CHECK
    # =========================

    if not email or not password:

        return Response({

            "error":
            "Email and Password are required"

        },status=400)

    # =========================
    # EXISTING USER CHECK
    # =========================

    existing_user = User.objects.filter(

        email=email

    ).first()

    if existing_user:

        return Response({

            "error":
            "Email already exists"

        },status=400)

    # =========================
    # CREATE USER
    # =========================

    user = User.objects.create_user(

        username=email,

        email=email,

        password=password,

        first_name=full_name

    )

    user.is_active = True

    user.save()

    # =========================
    # TOKENS
    # =========================

    tokens = get_tokens_for_user(user)

    return Response({

        "message":
        "User Registered Successfully",

        "access":
        tokens["access"],

        "refresh":
        tokens["refresh"],

        "user":{

            "id":
            user.id,

            "name":
            user.first_name,

            "email":
            user.email,

            "username":
            user.username,

            "is_admin":
            user.is_staff,

            "is_superuser":
            user.is_superuser

        }

    })


# =========================================
# LOGIN USER
# =========================================

@api_view(["POST"])

def login_user(request):

    data = request.data

    login_input = str(

        data.get("login","")

    ).strip()

    password = str(

        data.get("password","")

    ).strip()

    # =========================
    # EMPTY CHECK
    # =========================

    if not login_input or not password:

        return Response({

            "error":
            "Username and Password are required"

        },status=400)

    user = None

    # =========================
    # LOGIN WITH USERNAME
    # =========================

    user = authenticate(

        username=login_input,

        password=password

    )

    # =========================
    # LOGIN WITH EMAIL
    # =========================

    if not user:

        try:

            found_user = User.objects.get(

                email=login_input

            )

            user = authenticate(

                username=found_user.username,

                password=password

            )

        except User.DoesNotExist:

            user = None

    # =========================
    # INVALID LOGIN
    # =========================

    if not user:

        return Response({

            "error":
            "Invalid Username, Email or Password"

        },status=401)

    # =========================
    # ACCOUNT DISABLED
    # =========================

    if not user.is_active:

        return Response({

            "error":
            "Account Disabled"

        },status=401)

    # =========================
    # TOKENS
    # =========================

    tokens = get_tokens_for_user(user)

    return Response({

        "message":
        "Login Successful",

        "access":
        tokens["access"],

        "refresh":
        tokens["refresh"],

        "user":{

            "id":
            user.id,

            "name":
            user.first_name,

            "email":
            user.email,

            "username":
            user.username,

            "is_admin":
            user.is_staff,

            "is_superuser":
            user.is_superuser

        }

    })



# =========================================
# GOOGLE LOGIN
# =========================================

class GoogleLoginView(APIView):

    def post(self, request):

        token = request.data.get("token")

        if not token:

            return Response({
                "error": "Google token missing"
            }, status=400)

        if id_token is None or Request is None:

            return Response({
                "error": "google-auth package missing"
            }, status=500)

        try:

            user_data = id_token.verify_oauth2_token(
                token,
                Request(),
                "1056481750509-tamjc8high1hpu06vcjs3c806o1st2cv.apps.googleusercontent.com"
            )

            email = user_data.get("email")

            name = user_data.get("name", "")

            picture = user_data.get("picture", "")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,
                    "first_name": name
                }
            )

            user.is_active = True
            user.save()

            tokens = get_tokens_for_user(user)

            return Response({

                "message": "Google Login Successful",

                "access": tokens["access"],

                "refresh": tokens["refresh"],

                "user": {

                    "id": user.id,

                    "name": user.first_name,

                    "email": user.email,

                    "picture": picture,

                    "is_admin": user.is_staff,

                    "is_superuser": user.is_superuser

                }

            })

        except Exception as e:

            traceback.print_exc()

            return Response({

                "error": str(e)

            }, status=400)
