from rest_framework import serializers

from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        required=False
    )

    class Meta:

        model = Vehicle

        fields = "__all__"

        extra_kwargs = {
            "price_per_day": {"min_value": 0},
            "seats": {"min_value": 1},
        }
