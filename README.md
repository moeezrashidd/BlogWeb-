# BlogWeb

This repository contains a full-stack blog project: a Django backend and a React frontend.

Summary of recent changes
- Implemented client-side Sign Out button (Navbar) that calls POST /logout/, clears localStorage and React context, and navigates to /signIn.
- Added backend logout endpoint (POST /logout/) that flushes session if present.
- Switched to hashing passwords:
  - backend/blogApp/serializer.py now hashes passwords with Django's make_password on create/update and marks password as write-only.
  - backend/blogApp/views.py login flow now uses check_password and will transparently re-hash legacy plain-text passwords on first successful login.
- Settings updated for PythonAnywhere deployment (backend/BACKEND/settings.py): ALLOWED_HOSTS, CORS, CSRF_TRUSTED_ORIGINS, STATIC_ROOT, env-based SECRET_KEY/DEBUG, added corsheaders.
- Frontend API base is configured in frontend/src/config.js to point to https://moeezrashidd.pythonanywhere.com

This README covers how to deploy the backend to PythonAnywhere and test the sign-out flow.

Quick checklist (what to verify in the repo)
- frontend/src/config.js -> API_BASE_URL should be set to: https://moeezrashidd.pythonanywhere.com
- backend/BACKEND/settings.py -> DEBUG is env-driven and ALLOWED_HOSTS includes moeezrashidd.pythonanywhere.com
- backend/blogApp/serializer.py -> password hashing is enabled
- backend/blogApp/views.py -> login/logout endpoints in place
- Ensure a requirements.txt exists in backend/ (if not, create one) listing: Django, djangorestframework, django-cors-headers, Pillow, django-currentuser

Deploying / updating the backend on PythonAnywhere (step-by-step)

1) Pull the latest code on PythonAnywhere
- Open a Bash console on PythonAnywhere (username: moeezrashidd)
- Clone or pull the repo:
  cd ~
  git clone https://github.com/moeezrashidd/BlogWeb-.git BlogWeb || (cd BlogWeb && git pull origin main)

2) Create and activate a virtualenv (if not present)
- Example (adjust Python version as appropriate):
  python3.11 -m venv ~/venv-blogweb
  source ~/venv-blogweb/bin/activate

3) Install dependencies
- If backend/requirements.txt exists:
  pip install --upgrade pip
  pip install -r ~/BlogWeb/backend/requirements.txt
- If it doesn't exist, create a requirements.txt locally with these lines and push it first:
  Django
  djangorestframework
  django-cors-headers
  Pillow
  django-currentuser

4) Configure environment variables (Web tab → Environment variables)
- Add these (recommended):
  DJANGO_SECRET_KEY = <a long random string — do NOT commit>
  DJANGO_DEBUG = False

5) Migrate & collectstatic
- Activate venv and run migrations & collectstatic:
  source ~/venv-blogweb/bin/activate
  cd ~/BlogWeb/backend
  python manage.py migrate
  python manage.py collectstatic --noinput

6) Configure static & media mappings in PythonAnywhere Web tab
- Static mapping:
  URL: /static/  → Directory: /home/moeezrashidd/BlogWeb/backend/staticfiles
  URL: /media/   → Directory: /home/moeezrashidd/BlogWeb/backend/media

7) File permissions (ensure writable)
  chmod -R 755 ~/BlogWeb/backend/media
  chmod 664 ~/BlogWeb/backend/db.sqlite3

8) Reload web app (Web tab → Reload)

Smoke tests after deployment
- Create a user:
  curl -X POST https://moeezrashidd.pythonanywhere.com/users/ \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","username":"testuser","email":"test@example.com","password":"secret"}'

- Login:
  curl -X POST https://moeezrashidd.pythonanywhere.com/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"secret"}'
  Expect: 200 and JSON user object (password not included)

- Logout:
  curl -X POST https://moeezrashidd.pythonanywhere.com/logout/
  Expect: {"message":"Logged out successfully"}

Frontend testing (local or deployed)
- Run frontend locally with `npm start` (or serve the production build):
  - Sign in through the UI (SignIn page) — verify localStorage.loggedInUserId is set and Navbar shows the profile + Sign Out button.
  - Click Sign Out — verify POST /logout/ was called, localStorage cleared, currentUser cleared, and the UI navigates to /signIn.

Notes & recommended next steps
- Security:
  - DEBUG must be False in production and SECRET_KEY set via environment variable.
  - Consider migrating to Django's built-in User model and DRF Token/JWT auth for production-grade authentication.
  - SQLite is okay for small deployments but consider PostgreSQL for production.

- Code quality & convenience:
  - Add a backend/requirements.txt if missing — I'll add one on request.
  - Add a small `deploy_blogweb.sh` script to automate pull, pip install, migrate, collectstatic.
  - Add a central signOut() helper in frontend/src/Context/userContext.jsx so every component calls the same signOut logic.

If you want, I can now:
- Add or update backend/requirements.txt and push it, and/or
- Add a deploy script to the repo, and/or
- Update root README.md (this file) further with any other details you prefer.

To proceed with repository edits I will commit directly to main. Reply with which of the following you'd like me to push now:
- "requirements" — add backend/requirements.txt and push
- "deploy-script" — add a deploy script file
- "add-signout-helper" — implement central signOut in userContext and update Navbar to use it
- "all" — apply all three small changes and update README accordingly
- "none" — I will not make further changes
