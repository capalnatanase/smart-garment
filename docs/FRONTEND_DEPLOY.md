# Deploy React Frontend (Vercel or Netlify)

Deploy the **frontend** (React + Vite in `frontend/`) so it talks to your Laravel API on Laravel Cloud. Set the API URL via `VITE_API_BASE_URL` at build time.

**Prerequisites:** Backend is deployed and reachable (e.g. `https://your-app.laravelcloud.com/api/v1`). You have the repo on GitHub (same repo as the backend).

---

## 1. Set the API URL

The app uses `VITE_API_BASE_URL` (see `frontend/src/api/client.ts`). You must set this when building for production.

- **Value:** Your Laravel Cloud API base URL, with no trailing slash, e.g.  
  `https://your-app.laravelcloud.com/api/v1`
- Set it in the hosting dashboard as an **environment variable** (see below). Do not commit production URLs in `.env` if they’re secret; for a public API base URL, you can also use a build env.

---

## Option A: Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with the same Git account as your repo.
2. **Add New Project** → **Import** your `smart-garment` (or your repo name) repository.
3. **Configure:**
   - **Root Directory:** set to `frontend` (so Vercel builds the React app, not the repo root).
   - **Framework Preset:** Vite (or leave auto-detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default for Vite).
   - **Install Command:** `npm install` (default).
4. **Environment variables:** Add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://YOUR_LARAVEL_CLOUD_URL/api/v1`  
   (Replace with your real Laravel Cloud app URL.)
   - Attach it to **Production** (and optionally Preview if you want).
5. Click **Deploy**. After the build, Vercel gives you a URL like `https://smart-garment-xxx.vercel.app`.
6. **CORS:** In your Laravel backend, allow this origin (see [Backend CORS](#backend-cors) below).

**Custom domain (optional):** In the Vercel project → Settings → Domains, add your domain and follow the DNS instructions.

---

## Option B: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with your Git provider.
2. **Add new site** → **Import an existing project** → choose your Git provider and the `smart-garment` repo.
3. **Build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist` (Netlify resolves this relative to the base directory, so it will use `frontend/dist`).
   - **Functions:** leave default (you’re not using serverless functions).
4. **Environment variables:** Open **Site settings** → **Environment variables** → **Add a variable** (or **Add a variable** in the deploy step):
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://YOUR_LARAVEL_CLOUD_URL/api/v1`
   - **Scopes:** Production (and optionally Deploy Previews).
5. **Deploy site.** Netlify will build and give you a URL like `https://random-name-xxx.netlify.app`.
6. **CORS:** Allow this origin in the Laravel backend (see [Backend CORS](#backend-cors) below).

**Custom domain:** Site settings → Domain management → Add custom domain.

---

## Backend: allow your frontend origin (CORS and Sanctum)

Do this **in Laravel Cloud** so the API accepts requests from your Netlify (or Vercel) URL.

1. **Laravel Cloud** → your app → **Environment** → **Environment variables**.
2. **CORS** – add:
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** Your frontend URL, e.g. `https://your-site.netlify.app`  
     (or multiple comma-separated: `https://site1.netlify.app,https://site2.vercel.app`)
3. **Sanctum** (only if you use cookie-based SPA auth) – add:
   - **Key:** `SANCTUM_STATEFUL_DOMAINS`
   - **Value:** Frontend host only, e.g. `your-site.netlify.app` (no `https://`)
4. **Save** and trigger a **new deploy** (e.g. “Deploy” in the dashboard). The backend reads these at runtime, so a redeploy is required.

See [Laravel Cloud deploy doc](LARAVEL_CLOUD_DEPLOY.md#5-cors-and-sanctum-when-you-add-the-frontend) for more detail.

---

## Checklist

- [ ] Backend deployed and reachable at `https://.../api/v1`.
- [ ] Frontend repo (or monorepo) connected to Vercel or Netlify.
- [ ] Root directory set to `frontend`.
- [ ] `VITE_API_BASE_URL` set to `https://YOUR_LARAVEL_CLOUD_URL/api/v1`.
- [ ] Build succeeds; app loads at the Vercel/Netlify URL.
- [ ] Backend CORS (and Sanctum if used) updated and backend redeployed.
- [ ] Login/API calls from the deployed frontend work (check browser Network tab if not).

---

## Troubleshooting

- **Blank page or wrong API URL:** Confirm `VITE_API_BASE_URL` is set in the host’s env and that you redeployed after adding it (Vite bakes it in at build time).
- **CORS errors in browser:** Add the frontend origin to Laravel’s CORS config and to `SANCTUM_STATEFUL_DOMAINS` if using Sanctum; redeploy backend.
- **404 on refresh (client-side routes):** Vercel and Netlify support SPA redirects by default (e.g. `dist/index.html` for all routes). If you get 404s, add a redirect rule so all routes serve `index.html` (both hosts usually do this automatically for SPAs).
