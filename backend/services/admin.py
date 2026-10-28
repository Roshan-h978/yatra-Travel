from django.contrib import admin

from .models import Review, SupportMessage


@admin.register(SupportMessage)

class SupportMessageAdmin(admin.ModelAdmin):

    list_display = [

        'id',

        'customer_name',

        'email',

        'status',

        'created_at'

    ]

    search_fields = [

        'customer_name',

        'email'

    ]

    list_filter = [

        'status'

    ]


@admin.register(Review)

class ReviewAdmin(admin.ModelAdmin):

    list_display = ['id', 'user', 'rating', 'is_approved', 'created_at']

    list_filter = ['is_approved', 'rating']
