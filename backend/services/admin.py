from django.contrib import admin

from .models import SupportMessage


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