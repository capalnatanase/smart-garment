# Deploy Backend to Laravel Cloud (Option 2: API only)

This guide deploys only the **backend** (Laravel API in `backend/`) to Laravel Cloud. The React frontend is deployed separately (e.g. Vercel, Netlify).

## Prerequisites

- Laravel Cloud account at [cloud.laravel.com](https://cloud.laravel.com)
- Repo root has a `composer.lock` (copied from `backend/`) so Laravel Cloud detects a Laravel app
- Git repository connected to Laravel Cloud

## 1. Create the application in Laravel Cloud

1. Log in at [cloud.laravel.com](https://cloud.laravel.com).
2. **Create Application** → connect your Git provider and select the `smart-garment` repository.
3. Create an **Environment** (e.g. `production`) and choose the branch to deploy (e.g. `main`).

## 2. Monorepo build script

Because the Laravel app lives in `backend/`, you must use a **custom build script** so the deploy uses that directory.

In Laravel Cloud: go to your **Environment** → **Settings** (or **Build & Deploy** / **Deployments**) and set the **Build Command** to:

```bash
# ---------------------------------
# Monorepo: deploy "backend" as the Laravel app
# ---------------------------------

# Step 1: Create a temporary directory
mkdir -p /tmp/monorepo_tmp

# Step 2: Move backend and frontend out of the way
for dir in backend frontend; do
  [ -d "$dir" ] && mv "$dir" /tmp/monorepo_tmp/
done

# Step 3: Move backend contents to repo root (including hidden files)
cp -Rf /tmp/monorepo_tmp/backend/. .

# Step 4: Clean up
rm -rf /tmp/monorepo_tmp

# Step 5: Laravel build (API only – no frontend assets required)
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan event:cache
```

If Laravel Cloud has a separate **Deploy Command** (run after build), use something like:

```bash
php artisan migrate --force
```

(Or run migrations from the dashboard / one-off commands if you prefer.)

## 3. Environment variables

In the Laravel Cloud environment, set at least:

| Variable        | Description |
|----------------|-------------|
| `APP_KEY`      | Generate with `php artisan key:generate --show` and set in Laravel Cloud. |
| `APP_ENV`      | `production` |
| `APP_DEBUG`    | `false` |
| `APP_URL`      | Your Laravel Cloud app URL (e.g. `https://your-app.laravelcloud.com`). |

### Database

- In Laravel Cloud, attach a **Database** (MySQL or Postgres) to the environment.
- Laravel Cloud will inject `DB_*` variables; ensure your app uses them (no extra config needed if you rely on `.env` / `config/database.php`).

### Optional

- **Cache / sessions**: If you add Redis or similar in Laravel Cloud, set `CACHE_DRIVER`, `SESSION_DRIVER`, etc.
- **Queue**: If you use queues, configure a worker in Laravel Cloud and set `QUEUE_CONNECTION` as needed.

## 4. Deploy

- **Push to deploy**: Push to the branch linked to the environment to trigger a deploy.
- **Manual**: Use “Deploy” in the Laravel Cloud dashboard.
- **Deploy hook**: Enable in Settings and call the hook URL (e.g. from GitHub Actions) to deploy.

After a successful deploy, your API will be at:

`https://<your-environment>.laravelcloud.com/api/v1/...`

Use this as the backend base URL when you deploy the frontend (e.g. `VITE_API_BASE_URL=https://<your-environment>.laravelcloud.com/api/v1`).

## 5. CORS and Sanctum (when you add the frontend)

Once the React app is on another domain (e.g. Netlify or Vercel), do the following **in Laravel Cloud** (environment variables and redeploy).

### Step 1: Allow your frontend origin (CORS)

The project includes `backend/config/cors.php`, which reads allowed origins from the env var **`CORS_ALLOWED_ORIGINS`**.

- In **Laravel Cloud** → your Environment → **Environment variables**, add:
  - **Key:** `CORS_ALLOWED_ORIGINS`
  - **Value:** Your frontend URL(s), comma-separated, **no spaces**, e.g.  
    `https://your-app.netlify.app`  
    or multiple:  
    `https://your-app.netlify.app,https://your-app.vercel.app`
- If you **don’t** set this variable, the API allows all origins (`*`). Setting it restricts the API to your frontend only (recommended for production).

### Step 2: Sanctum stateful domains (if you use cookie-based SPA auth)

If you use Laravel Sanctum with cookies (not only Bearer tokens), add:

- **Key:** `SANCTUM_STATEFUL_DOMAINS`
- **Value:** Your frontend **host(s)** only, comma-separated, e.g.  
  `your-app.netlify.app`  
  or `your-app.netlify.app,your-app.vercel.app`

(No `https://`; host only.)

### Step 3: Redeploy the backend

After saving the new environment variables, trigger a **new deployment** (e.g. “Deploy” in the Laravel Cloud dashboard or push a commit). CORS and Sanctum use the env config at runtime, so a redeploy is required for changes to apply.

## 6. Troubleshooting

- **“Laravel framework version not supported”**  
  Ensure you’re on a supported Laravel minor (see [Laravel Cloud docs](https://cloud.laravel.com/docs/deployments#troubleshooting)). For Laravel 12, keep `laravel/framework` updated (e.g. `composer update laravel/framework` in `backend/`) and commit; the root `composer.lock` is only a signal for detection—the real lock used at build time is the one inside `backend/` after the copy.

- **Build fails on “composer install”**  
  The build script must run from the repo root after copying `backend` to root, so the copied `backend/composer.json` and `backend/composer.lock` are in the current directory. Double-check the `cp` steps and that no paths still point at `backend/`.

- **Database connection errors**  
  Confirm a database is attached to the environment and that Laravel Cloud has set `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (and `DB_PORT` if needed). Run `php artisan migrate --force` once the DB is attached.

- **Routes return 404**  
  Ensure `apiPrefix: 'api'` is set (you have it in `bootstrap/app.php`) and that deploy runs `php artisan route:cache` so routes are cached.

---

Next step: [Deploy the frontend](FRONTEND_DEPLOY.md) and set `VITE_API_BASE_URL` to your Laravel Cloud API URL.
