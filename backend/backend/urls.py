"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.contrib import admin

from django.urls import path
from django.urls import include
from django.conf import settings

from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/users/', include('users.urls')),

    path('api/vehicles/', include('vehicles.urls')),

    path('api/packages/', include('packages_app.urls')),

    path('api/bookings/', include('bookings.urls')),

    path('api/support/', include('services.urls')),

    path('api/drivers/', include('drivers.urls')),

    path('api/token/refresh/', TokenRefreshView.as_view()),

]

if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
