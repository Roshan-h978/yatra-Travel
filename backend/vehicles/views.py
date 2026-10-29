from backend.crud import build_crud_views

from .models import Vehicle
from .serializers import VehicleSerializer

get_vehicles, get_vehicle, add_vehicle, update_vehicle, delete_vehicle = build_crud_views(
    Vehicle, VehicleSerializer, "Vehicle", public_read=True, protect_active_bookings=True,
)
