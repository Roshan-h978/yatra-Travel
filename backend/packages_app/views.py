from backend.crud import build_crud_views

from .models import Package
from .serializers import PackageSerializer

get_packages, get_package, add_package, update_package, delete_package = build_crud_views(
    Package, PackageSerializer, "Package", public_read=True, protect_active_bookings=True,
)
