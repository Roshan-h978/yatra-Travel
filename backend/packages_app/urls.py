from backend.crud import crud_urlpatterns

from . import views

urlpatterns = crud_urlpatterns(
    views.get_packages,
    views.get_package,
    views.add_package,
    views.update_package,
    views.delete_package,
)
