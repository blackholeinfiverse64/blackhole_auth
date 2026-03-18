# BHIV Core - Identity & Product Launcher System

Enterprise-ready centralized IAM + app launcher for Blackhole Infiverse products.

## Architecture

- `backend/`: Node.js + Express auth server (JWT + secure cookie SSO)
- `frontend/`: React launcher dashboard (login/signup/dashboard)
- External products (e.g. `setu`, `sampada`, `niyantran`) remain independent repositories and consume shared auth cookie.

## Key Features

- Tenant-aware identity system with `users`, `tenants`, and `roles`
- SSO across subdomains via `HttpOnly` cookie on `.blackholeinfiverse.com`
- RBAC (`checkRole`, `checkPermission`) and app-level ACL (`checkAppAccess`)
- Central app launcher UI for assigned products
- Global logout that clears auth cookie for all apps
- External app middleware helper for quick integration

---

## Backend Setup (`/backend`)

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Set secure production values for:

- `MONGO_URI`
- `JWT_SECRET`
- `COOKIE_DOMAIN=.blackholeinfiverse.com`
- `COOKIE_SECURE=true`
- `CORS_ORIGINS` including dashboard + app origins

For local development:

- keep `COOKIE_DOMAIN` empty
- set `COOKIE_SECURE=false`
- include `http://localhost:5173` in `CORS_ORIGINS`
- make sure MongoDB is running at `127.0.0.1:27017` (or update `MONGO_URI`)

3. Seed default roles:

```bash
npm run seed:roles
```

4. Run API:

```bash
npm run dev
```

Backend default base URL: `http://localhost:8080`

### Auth APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### JWT Payload

```json
{
  "user_id": "...",
  "email": "user@org.com",
  "tenant_id": "...",
  "roles": ["employee"],
  "permissions": ["apps:read", "apps:launch"],
  "allowedApps": ["setu", "sampada"]
}
```

### Cookie Policy

- `httpOnly: true`
- `secure: true` (in production)
- `domain: ".blackholeinfiverse.com"`
- `path: "/"`

---

## Frontend Setup (`/frontend`)

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Set:

- Local: `VITE_API_BASE_URL=http://localhost:8080`
- Production: `VITE_API_BASE_URL=https://auth.blackholeinfiverse.com`

3. Run UI:

```bash
npm run dev
```

Frontend default local URL: `http://localhost:5173`

---

## Product Launcher Flow

1. User opens `https://products.blackholeinfiverse.com`
2. User logs in / signs up
3. Dashboard shows all available apps as cards
4. On app click:
   - frontend calls `GET /api/auth/me`
   - validates session and app access
   - redirects with `window.location.href = app.url`
5. Since token is in cross-subdomain HttpOnly cookie, user is already authenticated in target app

---

## External App Integration

Every external app repo should:

1. Use `cookie-parser`
2. Verify JWT from shared cookie
3. Validate `allowedApps` for that app slug
4. Redirect unauthenticated users to products dashboard

If user is already logged in on BHIV Core, then opening a product URL directly should not ask for password again.
This works when the product app protects routes with the shared middleware and validates the same SSO cookie.

### Quick middleware example

```js
const cookieParser = require("cookie-parser");
const { createVerifyUser } = require("./path/to/externalAppMiddleware");

app.use(cookieParser());

const verifySetuUser = createVerifyUser({
  jwtSecret: process.env.JWT_SECRET,
  authCookieName: process.env.AUTH_COOKIE_NAME || "bhiv_token",
  appSlug: "setu",
  redirectUrl: "https://products.blackholeinfiverse.com"
});

app.get("/dashboard", verifySetuUser, (req, res) => {
  res.send(`Welcome ${req.user.email}`);
});
```

### Direct product URL behavior (required)

- User visits `https://setu.blackholeinfiverse.com` directly
- Product middleware checks BHIV cookie
- If valid and app is allowed: enter app immediately
- If invalid/missing: redirect to `https://products.blackholeinfiverse.com/login`

Ready template file:

- `backend/src/integrations/examples/setuExpressIntegration.example.js`
- `backend/src/integrations/examples/multiAppExpressIntegration.example.js`

### App slug mapping (copy to each product repo)

Use these slugs consistently in:

- user `allowedApps` values
- middleware `appSlug`
- launcher config

Suggested map:

- `setu` -> `setu.blackholeinfiverse.com`
- `sampada` -> `sampada.blackholeinfiverse.com`
- `niyantran` -> `niyantran.blackholeinfiverse.com`
- `gurukul` -> `gurukul.blackholeinfiverse.com`
- `mitra` -> `mitra.blackholeinfiverse.com`
- `app06` -> `app06.blackholeinfiverse.com`
- `app07` -> `app07.blackholeinfiverse.com`
- `app08` -> `app08.blackholeinfiverse.com`
- `app09` -> `app09.blackholeinfiverse.com`
- `app10` -> `app10.blackholeinfiverse.com`
- `app11` -> `app11.blackholeinfiverse.com`
- `app12` -> `app12.blackholeinfiverse.com`
- `app13` -> `app13.blackholeinfiverse.com`
- `app14` -> `app14.blackholeinfiverse.com`
- `app15` -> `app15.blackholeinfiverse.com`
- `app16` -> `app16.blackholeinfiverse.com`

### Ready middleware block (all 16 apps)

```js
const baseOptions = {
  jwtSecret: process.env.JWT_SECRET,
  authCookieName: process.env.AUTH_COOKIE_NAME || "bhiv_token",
  redirectUrl: "https://products.blackholeinfiverse.com/login"
};

const appGuards = {
  setu: createVerifyUser({ ...baseOptions, appSlug: "setu" }),
  sampada: createVerifyUser({ ...baseOptions, appSlug: "sampada" }),
  niyantran: createVerifyUser({ ...baseOptions, appSlug: "niyantran" }),
  gurukul: createVerifyUser({ ...baseOptions, appSlug: "gurukul" }),
  mitra: createVerifyUser({ ...baseOptions, appSlug: "mitra" }),
  app06: createVerifyUser({ ...baseOptions, appSlug: "app06" }),
  app07: createVerifyUser({ ...baseOptions, appSlug: "app07" }),
  app08: createVerifyUser({ ...baseOptions, appSlug: "app08" }),
  app09: createVerifyUser({ ...baseOptions, appSlug: "app09" }),
  app10: createVerifyUser({ ...baseOptions, appSlug: "app10" }),
  app11: createVerifyUser({ ...baseOptions, appSlug: "app11" }),
  app12: createVerifyUser({ ...baseOptions, appSlug: "app12" }),
  app13: createVerifyUser({ ...baseOptions, appSlug: "app13" }),
  app14: createVerifyUser({ ...baseOptions, appSlug: "app14" }),
  app15: createVerifyUser({ ...baseOptions, appSlug: "app15" }),
  app16: createVerifyUser({ ...baseOptions, appSlug: "app16" })
};
```

Per repo usage:

- In `setu` repo: `app.get("/", appGuards.setu, handler)`
- In `sampada` repo: `app.get("/", appGuards.sampada, handler)`
- In `app11` repo: `app.get("/", appGuards.app11, handler)`

---

## Tenant Isolation Guidance

All protected APIs in domain services should scope queries by:

- `tenant_id` from verified JWT (`req.user.tenant_id`)

Use helper:

- `backend/src/middleware/tenantScope.js` -> `withTenantFilter(req, filter)`

---

## Deployment Guide (Production)

### 1) DNS and subdomains

- `products.blackholeinfiverse.com` -> frontend
- `auth.blackholeinfiverse.com` -> backend
- app domains remain independent (`setu`, `sampada`, etc.)

### 2) HTTPS everywhere

- Mandatory for `Secure` cookie
- Use managed TLS certificates for all subdomains

### 3) Backend deployment

- Host on container platform or VM
- Use process manager (PM2/systemd) or container orchestrator
- Set strong `JWT_SECRET`
- Enable horizontal scaling (stateless JWT architecture)
- Put behind reverse proxy/load balancer

### 4) Frontend deployment

- Static hosting (Nginx, Vercel, Netlify, S3 + CDN)
- Ensure `VITE_API_BASE_URL` points to auth server

### 5) CORS and cookies

- Backend `credentials: true`
- Allowed origins must include products and app domains
- Cookie domain must be `.blackholeinfiverse.com`
- SameSite should be compatible with your navigation flow (`lax` default)

### 6) Logout everywhere

- Trigger `POST /api/auth/logout`
- Cookie cleared at parent domain => session invalid for all apps

---

## Project Files of Interest

- Backend entry: `backend/src/server.js`
- Backend app config: `backend/src/app.js`
- Auth controller: `backend/src/controllers/authController.js`
- Middleware:
  - `backend/src/middleware/verifyToken.js`
  - `backend/src/middleware/checkAppAccess.js`
  - `backend/src/middleware/checkRolePermission.js`
- External integration helper: `backend/src/integrations/externalAppMiddleware.js`
- Frontend entry: `frontend/src/main.jsx`
- Frontend routes: `frontend/src/App.jsx`
- Launcher page: `frontend/src/pages/DashboardPage.jsx`

---

## Notes for Scale

- Migrate JWT to short-lived access token + refresh token rotation if needed.
- Add audit logs for login, logout, role/app assignment changes.
- Introduce API gateway and centralized policy service as app count grows.
- Add Redis token deny-list for immediate revocation scenarios.
#   b l a c k h o l e _ a u t h  
 