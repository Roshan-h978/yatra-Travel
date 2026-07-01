from rest_framework import serializers

from .models import Package


class PackageSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        required=False
    )

    class Meta:

        model = Package

        fields = "__all__"