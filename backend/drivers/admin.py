from django.contrib import admin

from .models import Driver


@admin.register(Driver)

class DriverAdmin(admin.ModelAdmin):

    list_display = [

        'id',

        'full_name',

        'phone',

        'status',

        'experience_years'

    ]

    search_fields = [

        'full_name',

        'phone'

    ]

    list_filter = [

        'status'

    ]