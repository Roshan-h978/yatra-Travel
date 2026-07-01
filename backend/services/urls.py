from django.urls import path
from .analytics_views import dashboard_analytics

from .views import *


urlpatterns = [

    path(

        "",

        get_support_messages

    ),

    path(

        "create/",

        create_support_message

    ),

    path(

        "reply/<int:id>/",

        reply_support_message

    ),

    path(

        "delete/<int:id>/",

        delete_support_message

    ),
    path(

    "analytics/",

    dashboard_analytics

),

]