# Deploying Yatra Travel

| Part | Service | Config in this repo |
|---|---|---|
| Database + image storage | **Supabase** (PostgreSQL + Storage) | settings read `DATABASE_URL` and `SUPABASE_*` |
| Backend API (Django) | **Render** (free web service) | `render.yaml` |
| Frontend (React/Vite) | **Vercel** | `vercel.json` |
| Google sign-in | **Google Cloud** OAuth client | `GOOGLE_CLIENT_ID` / `VITE_GOOGLE_CLIENT_ID` |

Do the steps in order: each one gives you a value the next one needs.
**Never commit or share** passwords, keys or connection strings; paste them only into the
Render / Vercel dashboards.

---

## 1. Supabase: database + storage

1. Create a project at <https://supabase.com/dashboard> (pick a region near your users,
   e.g. *South Asia (Mumbai)*). Save the **database password** you choose.
2. **Database URL:** click **Connect** (top bar), go to **Session pooler**, and copy the URI.
   It looks like
   `postgresql://postgres.<project-ref>:[YOUR-PASSWORD]@aws-0-<region>.pooler.supabase.com:5432/postgres`.
   Replace `[YOUR-PASSWORD]` with your database password. This is your **`DATABASE_URL`**.
   > Use the *pooler* link, not "Direct connection": Render's free plan can't reach the direct one.
3. **Project ref:** the part of your project URL `https://<project-ref>.supabase.co`.
   This is **`SUPABASE_PROJECT_REF`**.
4. **Storage bucket:** go to **Storage**, then **New bucket**, name it `media`, and turn **Public bucket** on.
5. **S3 keys:** go to **Project Settings**, then **Storage**, then **S3 Connection**, and click **New access key**. Copy:
   - Access key ID: **`SUPABASE_S3_ACCESS_KEY_ID`**
   - Secret access key: **`SUPABASE_S3_SECRET_ACCESS_KEY`** (shown once)
   - Region shown on that page (e.g. `ap-south-1`): **`SUPABASE_S3_REGION`**

## 2. Render: backend

1. Sign in at <https://dashboard.render.com> with GitHub.
2. Click **New +**, then **Blueprint**, and pick the `yatra-Travel` repo. Render reads `render.yaml`.
3. Fill in the values it asks for:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | from Supabase step 2 |
   | `CORS_ALLOWED_ORIGINS` | your Vercel URL. Put `https://example.com` for now and fix it after step 3 |
   | `GOOGLE_CLIENT_ID` | your Google OAuth Client ID |
   | `SUPABASE_PROJECT_REF`, `SUPABASE_S3_REGION`, `SUPABASE_S3_ACCESS_KEY_ID`, `SUPABASE_S3_SECRET_ACCESS_KEY` | from Supabase steps 3–5 |
   | `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | optional: Gmail address + [App Password](https://myaccount.google.com/apppasswords). Leave empty to only log emails |

4. Click **Apply**. The build installs packages, collects static files and runs the database
   migrations on Supabase. When it's live, open `https://<your-service>.onrender.com/api/health/`
   and you should see `{"status": "ok"}`.
5. **Create your admin account:** in the service, open **Shell** and run
   ```bash
   python manage.py createsuperuser
   ```
   > Render's free plan has no Shell. Instead, run `createsuperuser` on your own computer with
   > `DATABASE_URL` set to the Supabase pooler link (PowerShell: `$env:DATABASE_URL = "..."`).
   > `seed_demo` refuses to run in production; it is for local demo data only.

## 3. Vercel: frontend

1. Sign in at <https://vercel.com> with GitHub, click **Add New**, then **Project**, and import `yatra-Travel`.
   Vercel detects Vite from `vercel.json`. Leave the root directory as the repo root.
2. Add **Environment Variables** before deploying:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-service>.onrender.com/api` |
   | `VITE_GOOGLE_CLIENT_ID` | same Google Client ID as on Render |

3. **Deploy**, then copy your site URL (e.g. `https://yatra-travel.vercel.app`).
4. Back on **Render**, go to **Environment**, set `CORS_ALLOWED_ORIGINS` to that exact URL (no trailing
   slash), and save. Render redeploys automatically.

> `VITE_*` values are baked in at build time. After changing one on Vercel, **redeploy**.

## 4. Google Cloud: allow the live site

1. Open <https://console.cloud.google.com/apis/credentials>, click your **OAuth 2.0 Client ID**.
2. Under **Authorized JavaScript origins**, add:
   - your Vercel URL, e.g. `https://yatra-travel.vercel.app`
   - `http://localhost:5173` (local development)
3. Save. Changes can take a few minutes to apply.

## 5. Check it works

- [ ] `https://<render>/api/health/` returns `{"status": "ok"}`
- [ ] Vercel site loads; **Vehicles** page shows an empty list (new database), with no errors
- [ ] Log in with your superuser, which takes you to `/admin` on the Vercel site
- [ ] Add a vehicle **with an image**; the image URL starts with `https://<project-ref>.supabase.co/storage/...`
- [ ] Register a customer, make a booking, approve it as admin
- [ ] "Continue with Google" works on the live site
- [ ] Refreshing a deep link (e.g. `/profile`) does not 404
- [ ] Django admin `https://<render>/admin/` shows its normal styles

## Notes

- **Free Render instances sleep** after ~15 minutes idle; the first request then takes ~50 s.
- Local development is unchanged: without `DATABASE_URL` / `SUPABASE_*` it uses SQLite and `backend/media/`.
- Pushing to `main` auto-deploys both Render and Vercel.
