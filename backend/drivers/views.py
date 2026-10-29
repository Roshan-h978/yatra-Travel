from backend.crud import build_crud_views

from .models import Driver
from .serializers import DriverSerializer

# Driver records are admin-only, including reads.
get_drivers, get_driver, add_driver, update_driver, delete_driver = build_crud_views(
    Driver, DriverSerializer, "Driver", protect_active_bookings=True,
)
