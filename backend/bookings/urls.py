from django.urls import path

from .views import *

urlpatterns = [

    path("", get_bookings),

    path("my/", get_my_bookings),

    path("create/", create_booking),

    path("cancel/<int:id>/", cancel_my_booking),

    path("update/<int:id>/", update_booking_status),

    path("delete/<int:id>/", delete_booking),

]
