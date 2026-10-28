from django.contrib.auth import get_user_model

from rest_framework import serializers


class CustomerSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source="first_name", read_only=True)

    booking_count = serializers.IntegerField(read_only=True)

    class Meta:

        model = get_user_model()

        fields = [
            "id",
            "name",
            "email",
            "username",
            "is_active",
            "is_staff",
            "date_joined",
            "last_login",
            "booking_count",
        ]
