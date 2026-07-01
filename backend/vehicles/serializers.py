from rest_framework import serializers

from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        required=False
    )

    class Meta:

        model = Vehicle

        fields = "__all__"