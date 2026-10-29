from django.contrib import admin

from .models import Driver


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'phone', 'email', 'license_number', 'experience_years', 'status']
    search_fields = ['full_name', 'phone', 'email', 'license_number']
    list_filter = ['status']
