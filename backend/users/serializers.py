from django.contrib.auth.models import User

from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):

    role = serializers.CharField(
        required=False
    )

    class Meta:

        model = User

        fields = [

            "username",
            "email",
            "password",
            "role"

        ]

        extra_kwargs = {

            "password":{

                "write_only":True

            }

        }

    def create(self,validated_data):

        role = validated_data.pop(
            "role",
            "customer"
        )

        user = User.objects.create_user(

            username=
            validated_data["username"],

            email=
            validated_data["email"],

            password=
            validated_data["password"]

        )

        # ADMIN ROLE

        if role == "admin":

            user.is_staff = True

            user.is_superuser = True

        user.save()

        return user