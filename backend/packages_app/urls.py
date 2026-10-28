from django.urls import path

from .views import *

urlpatterns = [

    path("", get_packages),

    path("<int:id>/", get_package),

    path("add/", add_package),

    path("update/<int:id>/", update_package),

    path("delete/<int:id>/", delete_package),

]
