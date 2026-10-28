from django.urls import path

from .views import *

urlpatterns = [

    path("register/", register_user),

    path("login/", login_user),

    path("google-login/", GoogleLoginView.as_view()),

    path("me/", current_user),

    path("change-password/", change_password),

    path("customers/", get_customers),

    path("customers/toggle/<int:id>/", toggle_customer_active),

]
