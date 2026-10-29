from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'vehicle', 'package', 'driver', 'status', 'pickup_date', 'return_date', 'total_price']
    list_select_related = ['vehicle', 'package', 'driver']
    search_fields = ['full_name', 'email', 'phone']
    list_filter = ['status', 'pickup_date']
    date_hierarchy = 'pickup_date'
    raw_id_fields = ['user']
    # Status and price change only through the API, which keeps vehicle
    # availability and customer emails in sync.
    readonly_fields = ['status', 'total_price', 'created_at', 'updated_at']
