from backend.crud import crud_urlpatterns

from . import views

urlpatterns = crud_urlpatterns(
    views.get_drivers,
    views.get_driver,
    views.add_driver,
    views.update_driver,
    views.delete_driver,
)
