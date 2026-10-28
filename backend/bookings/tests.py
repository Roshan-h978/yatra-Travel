from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache

from rest_framework.test import APITestCase

from drivers.models import Driver
from packages_app.models import Package
from services.models import Review, SupportMessage
from vehicles.models import Vehicle

from .models import Booking


User = get_user_model()


class ApiFlowTests(APITestCase):

    def setUp(self):

        # Throttle counters live in the cache; start every test fresh.
        cache.clear()

        self.admin = User.objects.create_user(
            username="admin@yatra.test", email="admin@yatra.test",
            password="Adm1n-pass-123", is_staff=True
        )

        self.vehicle = Vehicle.objects.create(
            name="Land Cruiser", brand="Toyota", price_per_day=1000,
            vehicle_type="SUV", rental_type="With Driver", seats=7,
            transmission="Auto", fuel_type="Diesel", description="Big"
        )

        self.package = Package.objects.create(
            title="Pokhara", location="Pokhara", duration="3 Days",
            price=5000, description="Lakes"
        )

    def login(self, login, password):

        res = self.client.post("/api/users/login/", {"login": login, "password": password})

        self.assertEqual(res.status_code, 200, res.data)

        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + res.data["access"])

        return res

    def register_customer(self, email="cust@yatra.test"):

        res = self.client.post("/api/users/register/", {
            "full_name": "Cust", "email": email, "password": "Cust0mer-pass-9"
        })

        self.assertEqual(res.status_code, 200, res.data)

        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + res.data["access"])

        return res

    def booking_payload(self, **overrides):

        data = {
            "full_name": "Cust", "email": "cust@yatra.test", "phone": "98000",
            "vehicle": self.vehicle.id, "pickup_date": "2026-11-01",
            "return_date": "2026-11-03", "special_request": "",
        }

        data.update(overrides)

        return data

    # ---------- public ----------

    def test_public_catalogue_and_routes_are_mounted(self):

        for url in ["/api/vehicles/", "/api/packages/", f"/api/vehicles/{self.vehicle.id}/", "/api/support/reviews/"]:

            self.assertEqual(self.client.get(url).status_code, 200, url)

    def test_anonymous_cannot_modify_or_read_private_data(self):

        self.assertEqual(self.client.delete(f"/api/vehicles/delete/{self.vehicle.id}/").status_code, 401)
        self.assertEqual(self.client.get("/api/bookings/").status_code, 401)
        self.assertEqual(self.client.get("/api/drivers/").status_code, 401)
        self.assertEqual(self.client.get("/api/support/").status_code, 401)
        self.assertEqual(self.client.get("/api/support/analytics/").status_code, 401)

    def test_missing_record_returns_404(self):

        self.login("admin@yatra.test", "Adm1n-pass-123")

        self.assertEqual(self.client.delete("/api/vehicles/delete/9999/").status_code, 404)

    # ---------- auth ----------

    def test_register_rejects_weak_password_and_duplicate_email(self):

        res = self.client.post("/api/users/register/", {"email": "a@b.test", "password": "123"})
        self.assertEqual(res.status_code, 400)

        self.register_customer()
        self.client.credentials()

        res = self.client.post("/api/users/register/", {"email": "CUST@yatra.test", "password": "Another-pass-77"})
        self.assertEqual(res.status_code, 400)

    def test_login_with_email_case_insensitive(self):

        self.register_customer()
        self.client.credentials()

        res = self.login("CUST@YATRA.TEST", "Cust0mer-pass-9")
        self.assertFalse(res.data["user"]["is_admin"])

        self.assertEqual(self.client.get("/api/users/me/").data["email"], "cust@yatra.test")

    def test_customer_is_not_admin(self):

        self.register_customer()

        self.assertEqual(self.client.get("/api/bookings/").status_code, 403)
        self.assertEqual(self.client.get("/api/users/customers/").status_code, 403)

    # ---------- bookings ----------

    def test_customer_booking_flow(self):

        me = self.register_customer().data["user"]

        res = self.client.post("/api/bookings/create/", self.booking_payload(user=999, total_price=1, status="Approved"))
        self.assertEqual(res.status_code, 201, res.data)

        booking = Booking.objects.get()
        self.assertEqual(booking.user_id, me["id"])
        self.assertEqual(booking.status, "Pending")
        self.assertEqual(booking.total_price, 3000)

        mine = self.client.get("/api/bookings/my/").data
        self.assertEqual(len(mine), 1)
        self.assertEqual(mine[0]["vehicle_name"], "Land Cruiser")

        # Overlapping dates on the same vehicle are refused.
        res = self.client.post("/api/bookings/create/", self.booking_payload(pickup_date="2026-11-02", return_date="2026-11-05"))
        self.assertEqual(res.status_code, 400)

    def test_booking_validation(self):

        self.register_customer()

        res = self.client.post("/api/bookings/create/", self.booking_payload(return_date="2026-10-01"))
        self.assertEqual(res.status_code, 400)

        res = self.client.post("/api/bookings/create/", self.booking_payload(vehicle=""))
        self.assertEqual(res.status_code, 400)

        res = self.client.post("/api/bookings/create/", self.booking_payload(vehicle="", package=self.package.id))
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(Booking.objects.get().total_price, 5000)

    def test_anonymous_cannot_book(self):

        self.assertEqual(self.client.post("/api/bookings/create/", self.booking_payload()).status_code, 401)

    def test_admin_updates_status_and_assigns_driver(self):

        self.register_customer()
        self.client.post("/api/bookings/create/", self.booking_payload())
        booking = Booking.objects.get()

        driver = Driver.objects.create(
            full_name="Ram", phone="1", email="r@d.test",
            license_number="L1", experience_years=5, address="KTM"
        )

        self.client.credentials()
        self.login("admin@yatra.test", "Adm1n-pass-123")

        res = self.client.put(f"/api/bookings/update/{booking.id}/", {"status": "Bogus"})
        self.assertEqual(res.status_code, 400)

        mail.outbox.clear()

        res = self.client.put(f"/api/bookings/update/{booking.id}/", {"status": "Approved", "driver": driver.id})
        self.assertEqual(res.status_code, 200, res.data)
        self.assertEqual(res.data["booking"]["driver_name"], "Ram")
        self.assertEqual(len(mail.outbox), 1)

        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.status, "Booked")

        self.client.put(f"/api/bookings/update/{booking.id}/", {"status": "Completed"})
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.status, "Available")

        analytics = self.client.get("/api/support/analytics/").data
        self.assertEqual(analytics["total_revenue"], 3000)
        self.assertEqual(analytics["total_customers"], 1)

    # ---------- admin catalogue ----------

    def test_admin_crud_vehicle_and_driver(self):

        self.login("admin@yatra.test", "Adm1n-pass-123")

        res = self.client.put(f"/api/vehicles/update/{self.vehicle.id}/", {"status": "Maintenance"})
        self.assertEqual(res.status_code, 200, res.data)

        res = self.client.post("/api/drivers/add/", {
            "full_name": "Hari", "phone": "1", "email": "h@d.test",
            "license_number": "L2", "experience_years": 3, "address": "PKR"
        })
        self.assertEqual(res.status_code, 200, res.data)
        self.assertEqual(len(self.client.get("/api/drivers/").data), 1)

        self.assertEqual(len(self.client.get("/api/users/customers/").data), 1)

    # ---------- support & reviews ----------

    def test_support_flow(self):

        res = self.client.post("/api/support/create/", {
            "customer_name": "Guest", "email": "g@x.test", "subject": "Hi", "message": "Help", "status": "Closed"
        })
        self.assertEqual(res.status_code, 201, res.data)
        msg = SupportMessage.objects.get()
        self.assertEqual(msg.status, "Pending")

        self.login("admin@yatra.test", "Adm1n-pass-123")

        self.assertEqual(self.client.put(f"/api/support/reply/{msg.id}/", {"admin_reply": " "}).status_code, 400)
        self.assertEqual(self.client.put(f"/api/support/reply/{msg.id}/", {"admin_reply": "Sure"}).status_code, 200)

        msg.refresh_from_db()
        self.assertEqual(msg.status, "Replied")

    def test_review_flow(self):

        self.register_customer()

        res = self.client.post("/api/support/reviews/create/", {"rating": 5, "comment": "Great", "is_approved": True})
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(len(self.client.get("/api/support/reviews/").data), 0)

        self.client.credentials()
        self.login("admin@yatra.test", "Adm1n-pass-123")

        review = Review.objects.get()
        self.client.put(f"/api/support/reviews/update/{review.id}/", {"is_approved": True})

        self.client.credentials()
        self.assertEqual(len(self.client.get("/api/support/reviews/").data), 1)

    # ---------- review round 2 ----------

    def make_booking(self, **overrides):

        self.client.credentials()
        self.register_customer()
        res = self.client.post("/api/bookings/create/", self.booking_payload(**overrides))
        self.assertEqual(res.status_code, 201, res.data)
        self.client.credentials()
        self.login("admin@yatra.test", "Adm1n-pass-123")
        return Booking.objects.latest("id")

    def test_status_transitions_and_reapprove_overlap(self):

        first = self.make_booking()

        self.assertEqual(self.client.put(f"/api/bookings/update/{first.id}/", {"status": "Completed"}).status_code, 400)
        self.assertEqual(self.client.put(f"/api/bookings/update/{first.id}/", {"status": "Rejected"}).status_code, 200)

        # Someone else books the same dates, then admin tries to re-open the rejected one.
        self.client.credentials()
        self.register_customer("other@yatra.test")
        self.assertEqual(self.client.post("/api/bookings/create/", self.booking_payload(email="other@yatra.test")).status_code, 201)
        self.client.credentials()
        self.login("admin@yatra.test", "Adm1n-pass-123")

        res = self.client.put(f"/api/bookings/update/{first.id}/", {"status": "Pending"})
        self.assertEqual(res.status_code, 400, res.data)

    def test_vehicle_status_follows_bookings(self):

        booking = self.make_booking()
        self.client.put(f"/api/bookings/update/{booking.id}/", {"status": "Approved"})
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.status, "Booked")

        # Delete is refused while the vehicle has an active booking.
        self.assertEqual(self.client.delete(f"/api/vehicles/delete/{self.vehicle.id}/").status_code, 400)

        self.client.delete(f"/api/bookings/delete/{booking.id}/")
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.status, "Available")

    def test_bad_inputs_return_400_not_500(self):

        booking = self.make_booking()

        self.assertEqual(self.client.put(f"/api/bookings/update/{booking.id}/", {"driver": "abc"}, format="json").status_code, 400)
        self.assertEqual(self.client.put(f"/api/bookings/update/{booking.id}/", {"status": ["Approved"]}, format="json").status_code, 400)

        res = self.client.post("/api/packages/add/", {
            "title": "X", "location": "Y", "duration": "1 Day", "price": -5, "description": "Z", "rating": 99
        })
        self.assertEqual(res.status_code, 400)

    def test_past_and_overlong_bookings_rejected(self):

        self.register_customer()

        self.assertEqual(self.client.post("/api/bookings/create/", self.booking_payload(pickup_date="2020-01-01", return_date="2020-01-02")).status_code, 400)
        self.assertEqual(self.client.post("/api/bookings/create/", self.booking_payload(return_date="2027-06-01")).status_code, 400)

    def test_public_reviews_hide_email_and_string_false_unapproves(self):

        self.client.post("/api/users/register/", {"email": "noname@yatra.test", "password": "Cust0mer-pass-9"})
        self.login("noname@yatra.test", "Cust0mer-pass-9")
        self.client.post("/api/support/reviews/create/", {"rating": 4, "comment": "Nice"})

        review = Review.objects.get()
        review.is_approved = True
        review.save()

        public = self.client.get("/api/support/reviews/").data[0]
        self.assertNotIn("noname@yatra.test", str(public))
        self.assertNotIn("user", public)

        self.client.credentials()
        self.login("admin@yatra.test", "Adm1n-pass-123")
        self.assertEqual(self.client.put(f"/api/support/reviews/update/{review.id}/", {"is_approved": "false"}).status_code, 200)
        review.refresh_from_db()
        self.assertFalse(review.is_approved)

    def test_staff_cannot_deactivate_superuser_and_last_login_set(self):

        boss = User.objects.create_superuser(username="boss@yatra.test", email="boss@yatra.test", password="B0ss-pass-123")

        self.login("admin@yatra.test", "Adm1n-pass-123")
        self.assertEqual(self.client.put(f"/api/users/customers/toggle/{boss.id}/").status_code, 403)

        self.admin.refresh_from_db()
        self.assertIsNotNone(self.admin.last_login)

    def test_login_is_rate_limited(self):

        for _ in range(10):
            self.client.post("/api/users/login/", {"login": "x@y.test", "password": "wrong"})

        self.assertEqual(self.client.post("/api/users/login/", {"login": "x@y.test", "password": "wrong"}).status_code, 429)

    # ---------- profile page ----------

    def test_customer_cancels_own_booking(self):

        self.register_customer()
        self.client.post("/api/bookings/create/", self.booking_payload())
        booking = Booking.objects.get()

        # Another customer cannot cancel it.
        self.client.credentials()
        self.register_customer("intruder@yatra.test")
        self.assertEqual(self.client.put(f"/api/bookings/cancel/{booking.id}/").status_code, 404)

        self.client.credentials()
        self.login("cust@yatra.test", "Cust0mer-pass-9")
        res = self.client.put(f"/api/bookings/cancel/{booking.id}/")
        self.assertEqual(res.status_code, 200, res.data)
        self.assertEqual(res.data["booking"]["status"], "Cancelled")

        # Cancelling twice is refused, and the dates are free again.
        self.assertEqual(self.client.put(f"/api/bookings/cancel/{booking.id}/").status_code, 400)
        self.assertEqual(self.client.post("/api/bookings/create/", self.booking_payload()).status_code, 201)

    def test_cannot_cancel_started_trip(self):

        from django.utils import timezone

        self.register_customer()
        self.client.post("/api/bookings/create/", self.booking_payload())
        booking = Booking.objects.get()
        Booking.objects.filter(id=booking.id).update(pickup_date=timezone.localdate())

        self.assertEqual(self.client.put(f"/api/bookings/cancel/{booking.id}/").status_code, 400)

    def test_update_profile_name(self):

        self.register_customer()

        self.assertEqual(self.client.put("/api/users/me/", {"name": " "}).status_code, 400)

        res = self.client.put("/api/users/me/", {"name": "New Name"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["name"], "New Name")
        self.assertIn("date_joined", res.data)

    def test_change_password(self):

        self.register_customer()

        self.assertEqual(self.client.post("/api/users/change-password/", {"current_password": "wrong", "new_password": "Brand-new-pass-1"}).status_code, 400)
        self.assertEqual(self.client.post("/api/users/change-password/", {"current_password": "Cust0mer-pass-9", "new_password": "123"}).status_code, 400)
        self.assertEqual(self.client.post("/api/users/change-password/", {"current_password": "Cust0mer-pass-9", "new_password": "Brand-new-pass-1"}).status_code, 200)

        self.client.credentials()
        self.login("cust@yatra.test", "Brand-new-pass-1")

    def test_my_reviews(self):

        self.register_customer()
        self.client.post("/api/support/reviews/create/", {"rating": 5, "comment": "Great"})

        mine = self.client.get("/api/support/reviews/my/").data
        self.assertEqual(len(mine), 1)
        self.assertFalse(mine[0]["is_approved"])
