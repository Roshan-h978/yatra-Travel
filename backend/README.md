# Backend - Yatra Travel

Quick steps to run the Django backend locally using the existing repository `venv`.

Prerequisites: Windows, `venv` exists at repository root (do not create another virtualenv).

1. Activate the existing venv (PowerShell):

```powershell
venv\Scripts\Activate.ps1
```

2. Install dependencies (if not already):

```powershell
python -m pip install -r requirements.txt
```

3. Apply migrations and create the local DB (SQLite fallback is enabled):

```powershell
python manage.py migrate
```

4. Run the development server:

```powershell
python manage.py runserver 8000
```

Open http://127.0.0.1:8000/ to verify the API is up.

If you prefer Postgres for local development, update `backend/settings.py` to set DB credentials and remove `db.sqlite3`.
