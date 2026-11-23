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

Open `http://localhost:3000`. Vite forwards `/api` requests to Express on `127.0.0.1:5000` by default. Set `PORT` in the root `.env` or the shell to change the Express port. To run either server separately, use `npm run server` or `npm run client`.

## Frontend production build

```powershell
npm run build
```

Vite writes the static frontend to `client/build`. Run `npm start` to serve the built frontend and `/api` from the same Express server. Open `http://localhost:5000` by default.

## Deploy to Render

The Blueprint defines two services. `spomenar-public-demo` is a Static Site for sharing. `spomenar-demo` is the existing Node web service for owner login and editing published data.

### Public static demo

Push the code and sync the existing Render Blueprint. Open the `onrender.com` URL Render assigns to `spomenar-public-demo`. Its build embeds the sample spomenar, questions and example answers. It needs no backend or secrets. The Blueprint rewrites direct React routes such as `/try-create` to `index.html`.

To run it locally with the frontend dependencies installed:

```powershell
$env:STATIC_DEMO = 'true'
npm run client
```

### Node web service

1. When setting up the web service for the first time, choose **New → Blueprint** in the Render Dashboard and connect the repository.
2. Supply `MONGO_URI` when prompted. Render generates `JWT_SECRET` and `ADMIN_KEY`. Demo mode disables registration and email-based account recovery, so the demo runs without Resend credentials.
3. In the new Render service, open **Connect → Outbound**. Add the listed ranges to the MongoDB Atlas project under **Network Access**. Redeploy if the initial startup could not connect to Atlas.
4. Open the public URL and check `/api/dicts` for a successful JSON response. The server uses the Render URL for email links by default. Set `APP_URL` on the service if you use a custom domain.

## Environment variables

| Variable | Used for |
| --- | --- |
| `MONGO_URI` | MongoDB connection string for database-backed routes |
| `APP_URL` | Optional frontend origin for email links. Defaults to Render's public URL on Render and `http://localhost:3000` locally. |
| `DEMO_MODE` | Set to `true` to disable registration and email-based account recovery and let guests try creating and answering spomenars with browser-only drafts. The Render Blueprint enables it. Rebuild the frontend after changing it. |
| `STATIC_DEMO` | Set to `true` at frontend build time to enable demo mode, embed the sample and omit account access. The static site sets it in the Blueprint. |
| `JWT_SECRET` | Signing and verifying authentication tokens |
| `EMAIL_FROM` | Sender address on a verified Resend domain for deployments with registration enabled |
| `RESEND_API_KEY` | Resend key with sending access for deployments with registration enabled |
| `ADMIN_KEY` | Credential for routes guarded by the `admin-key` header |
| `PORT` | Optional Express port, defaults to `5000` |
