from django.urls import path

from .views import *

urlpatterns = [

    path("", get_vehicles),

    path("<int:id>/", get_vehicle),

    path("add/", add_vehicle),

    path("update/<int:id>/", update_vehicle),

    path("delete/<int:id>/", delete_vehicle),

]
