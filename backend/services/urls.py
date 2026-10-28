from django.urls import path

from .analytics_views import dashboard_analytics

from .views import *

urlpatterns = [

    path("", get_support_messages),

    path("create/", create_support_message),

    path("reply/<int:id>/", reply_support_message),

    path("close/<int:id>/", close_support_message),

    path("delete/<int:id>/", delete_support_message),

    path("analytics/", dashboard_analytics),

    path("reviews/", get_reviews),

    path("reviews/all/", get_all_reviews),

    path("reviews/my/", get_my_reviews),

    path("reviews/create/", create_review),

    path("reviews/update/<int:id>/", update_review),

    path("reviews/delete/<int:id>/", delete_review),

]
