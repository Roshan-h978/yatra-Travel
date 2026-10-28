from django.urls import path

from .views import *

urlpatterns = [

    path("", get_drivers),

    path("<int:id>/", get_driver),

    path("add/", add_driver),

    path("update/<int:id>/", update_driver),

    path("delete/<int:id>/", delete_driver),

]
