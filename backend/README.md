# Backend - Yatra Travel

See the root `README.md` for full setup. Short version (PowerShell):

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo      # optional demo data
python manage.py runserver 8000
```

- Database: SQLite by default; set `DB_ENGINE=postgres` + `DB_*` env vars for PostgreSQL.
- Settings come from environment variables; see `.env.example`.
- Tests: `python manage.py test`
