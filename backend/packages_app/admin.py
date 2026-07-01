from django.contrib import admin

from .models import Package


@admin.register(Package)

class PackageAdmin(admin.ModelAdmin):

    list_display = [

        'id',

        'title',

        'location',

        'price',

        'rating',

        'is_featured'

    ]

    search_fields = [

        'title',

        'location'

    ]