from backend.crud import crud_urlpatterns

from . import views

urlpatterns = crud_urlpatterns(
    views.get_vehicles,
    views.get_vehicle,
    views.add_vehicle,
    views.update_vehicle,
    views.delete_vehicle,
)
