from rest_framework import serializers

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):

    class Meta:

        model = Driver

        fields = "__all__"

        extra_kwargs = {
            "experience_years": {"min_value": 0},
        }
