# spomenarapp
Web app to create, read and answer collections of questions made by users.

## Local development on Windows

Use Node.js 24.14.0. From the repository root in PowerShell, install both sets of dependencies from their lockfiles.

```powershell
npm ci
npm run client-install
```

Copy `.env.example` to `.env` in the repository root and fill in the settings for your development services. Use a development MongoDB database with `MONGO_URI`.

```powershell
npm run dev
```

Open `http://localhost:3000`. Vite forwards `/api` requests to Express on `127.0.0.1:5000` by default. Set `PORT` in the root `.env` or the shell to change the Express port. The frontend uses port 3000 for the existing email verification and password reset links. To run either server separately, use `npm run server` or `npm run client`.

## Frontend production build

```powershell
npm run build
```

Vite writes the static frontend to `client/build`. The application makes same-origin requests to `/api`.

## Environment variables

| Variable | Used for |
| --- | --- |
| `MONGO_URI` | MongoDB connection string for database-backed routes |
| `JWT_SECRET` | Signing and verifying authentication tokens |
| `EMAIL`, `EMAIL_PASS` | Gmail SMTP credentials for verification and password reset emails |
| `ADMIN_KEY` | Credential for routes guarded by the `admin-key` header |
| `PORT` | Optional Express port, defaults to `5000` |
