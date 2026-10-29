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

from django.http import JsonResponse

from rest_framework_simplejwt.views import TokenRefreshView


def health(request):

    # Used by Render's health check; no database or login needed.
    return JsonResponse({"status": "ok"})

urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/health/', health),

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
