from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from drivers.models import Driver
from packages_app.models import Package
from vehicles.models import Vehicle


# Local development only. Change these before using the data anywhere shared.
DEMO_ADMIN_EMAIL = "admin@yatra.local"
DEMO_ADMIN_PASSWORD = "***REMOVED***"
DEMO_CUSTOMER_EMAIL = "customer@yatra.local"
DEMO_CUSTOMER_PASSWORD = "***REMOVED***"


class Command(BaseCommand):

    help = "Create a demo admin account plus sample vehicles, packages and a driver."

    def handle(self, *args, **options):

        User = get_user_model()

        admin, created = User.objects.get_or_create(
            username=DEMO_ADMIN_EMAIL,
            defaults={
                "email": DEMO_ADMIN_EMAIL,
                "first_name": "Yatra Admin",
                "is_staff": True,
                "is_superuser": True,
            },
        )

        if created:
            admin.set_password(DEMO_ADMIN_PASSWORD)
            admin.save()

        if not User.objects.filter(email__iexact=DEMO_CUSTOMER_EMAIL).exists():
            User.objects.create_user(
                username=DEMO_CUSTOMER_EMAIL,
                email=DEMO_CUSTOMER_EMAIL,
                password=DEMO_CUSTOMER_PASSWORD,
                first_name="Demo Customer",
            )

        vehicles = [
            ("Land Cruiser Prado", "Toyota", 12000, "SUV", "With Driver", 7, "vehicles/toyota.jpg"),
            ("Everest", "Ford", 10000, "SUV", "Self Drive", 7, "vehicles/frod.jpg"),
            ("Scorpio N", "Mahindra", 8000, "Jeep", "With Driver", 7, "vehicles/2a63ce2da1965412eff3cb784c4178cd.jpg"),
            ("Range Rover Sport", "Land Rover", 25000, "Luxury", "With Driver", 5, ""),
        ]

        for name, brand, price, vtype, rental, seats, image in vehicles:
            Vehicle.objects.get_or_create(
                name=name,
                defaults={
                    "brand": brand, "price_per_day": price, "vehicle_type": vtype,
                    "rental_type": rental, "seats": seats, "transmission": "Automatic",
                    "fuel_type": "Diesel", "image": image,
                    "description": f"Comfortable {brand} {name} for Nepal roads.",
                },
            )

        packages = [
            ("Pokhara Lakeside Escape", "Pokhara", "3 Days", 25000, True),
            ("Chitwan Jungle Safari", "Chitwan", "2 Days", 18000, False),
            ("Upper Mustang Adventure", "Mustang", "7 Days", 95000, True),
        ]

        for title, location, duration, price, featured in packages:
            Package.objects.get_or_create(
                title=title,
                defaults={
                    "location": location, "duration": duration, "price": price,
                    "is_featured": featured, "rating": 4.8,
                    "description": f"A curated {duration.lower()} trip to {location}.",
                },
            )

        Driver.objects.get_or_create(
            license_number="BA-01-12345",
            defaults={
                "full_name": "Ram Bahadur", "phone": "9800000000", "email": "ram@yatra.local",
                "experience_years": 8, "address": "Kathmandu",
            },
        )

        self.stdout.write(self.style.SUCCESS(
            f"Demo data ready. Admin: {DEMO_ADMIN_EMAIL}, customer: {DEMO_CUSTOMER_EMAIL} (passwords in users/management/commands/seed_demo.py)"
        ))
