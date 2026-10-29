# Yatra Travel

Luxury travel and vehicle-rental site for Nepal.

- **Frontend:** React 19 + Vite (`src/`)
- **Backend:** Django 6 + Django REST Framework + SimpleJWT (`backend/`)

## Quick start (local development)

### 1. Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo      # optional: demo admin, customer, vehicles, packages, driver
python manage.py runserver 8000
```

The backend uses SQLite (`backend/db.sqlite3`) by default. To use PostgreSQL, set
`DB_ENGINE=postgres` and the `DB_*` variables listed in `backend/.env.example`.

Create your own admin with `python manage.py createsuperuser`. Admins log in on the
normal login page and are sent to `/admin`.

Emails (booking status, support replies) are printed to the backend console unless
`EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` are set.

### 2. Frontend

```powershell
npm install
npm run dev        # http://localhost:5173
```

Optional: copy `.env.example` to `.env` to change the API URL or Google client ID.
The backend only accepts browser requests from the origins in `CORS_ALLOWED_ORIGINS`
(default `http://localhost:5173`).

### Checks

```powershell
npm run lint
npm run build
cd backend; python manage.py test
```

## Features

| Area | What it does |
|---|---|
| Public site | Browse vehicles (filter by type) and tour packages (filter by destination), contact form |
| Customers | Register / login (email or Google), book a vehicle and/or package, see "My Bookings", leave a review |
| Admin `/admin` | Live dashboard and analytics; manage vehicles, packages, drivers (add / edit / delete); approve, reject or complete bookings and assign drivers; customers (activate / deactivate); publish reviews; reply to support messages |

Booking rules enforced by the server: the logged-in user owns the booking, the price is
calculated server-side (days × daily rate + package price), return date must be on or
after pickup, and a vehicle can't be double-booked for overlapping dates.

## API overview (`/api/...`)

| Endpoint | Access |
|---|---|
| `users/register/`, `users/login/`, `users/google-login/`, `token/refresh/` | Public |
| `users/me/` | Logged in |
| `users/customers/`, `users/customers/toggle/<id>/` | Admin |
| `vehicles/`, `vehicles/<id>/`, `packages/`, `packages/<id>/` | Public read |
| `vehicles`, `packages`, `drivers`: `add/`, `update/<id>/`, `delete/<id>/`; `drivers/` | Admin |
| `bookings/create/`, `bookings/my/` | Logged in |
| `bookings/`, `bookings/update/<id>/` (status, driver), `bookings/delete/<id>/` | Admin |
| `support/create/`, `support/reviews/` | Public |
| `support/reviews/create/` | Logged in |
| `support/`, `support/reply|close|delete/<id>/`, `support/analytics/`, `support/reviews/all|update|delete/` | Admin |

## Deployment

Supabase (database + image storage), Render (backend) and Vercel (frontend).
Step-by-step guide: **[DEPLOY.md](DEPLOY.md)**.
