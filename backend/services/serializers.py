from rest_framework import serializers

from .models import Review, SupportMessage


class SupportMessageSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = SupportMessage

        fields = "__all__"

        read_only_fields = ["admin_reply", "status", "created_at", "updated_at"]


class ReviewSerializer(serializers.ModelSerializer):

    user_name = serializers.SerializerMethodField()

    class Meta:

        model = Review

        fields = ["id", "user_name", "rating", "comment", "is_approved", "created_at"]

        read_only_fields = ["is_approved", "created_at"]

    def get_user_name(self, obj):

        # Never fall back to the username: it is the customer's email address.
        return obj.user.first_name or "Yatra traveller"
