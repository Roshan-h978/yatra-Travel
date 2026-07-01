from django.contrib import admin

from .models import Booking


@admin.register(Booking)

class BookingAdmin(admin.ModelAdmin):

    list_display = [

        'id',

        'full_name',

        'email',

        'status',

        'pickup_date',

        'return_date'

    ]

    search_fields = [

        'full_name',

        'email'

    ]

    list_filter = [

        'status',

    ]