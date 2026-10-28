from rest_framework import serializers

from .models import Package


class PackageSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        required=False
    )

    class Meta:

        model = Package

        fields = "__all__"

        extra_kwargs = {
            "price": {"min_value": 0},
            "rating": {"min_value": 0, "max_value": 5},
        }
