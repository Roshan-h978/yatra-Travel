from django.contrib import admin

from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'brand', 'vehicle_type', 'rental_type', 'price_per_day', 'status']
    search_fields = ['name', 'brand']
    list_filter = ['vehicle_type', 'rental_type', 'status']
