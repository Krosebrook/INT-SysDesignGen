# Deployment Guide

## Build Pipeline

The application is built using Vite/Webpack (standard React tooling).

```bash
# Production Build
npm run build
```

**Artifacts**:
- `index.html`: Entry point.
- `assets/*.js`: Bundled logic.
- `assets/*.css`: Tailwind styles.
- `sw.js`: Generated Service Worker.
- `manifest.json`: PWA Manifest.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Google Gemini API Key | Yes |

## PWA Configuration

The Service Worker (`sw.js`) uses **Workbox v6**.

### Caching Strategy
1. **Security Routes** (`/auth`, `/moderation`): `NetworkOnly`. Never cached.
2. **API Routes** (`/api/`): `NetworkFirst`. Falls back to cache if offline.
3. **Static Assets** (JS/CSS/Images): `StaleWhileRevalidate`.

### Manifest
Ensure `manifest.json` is present in the build root. It defines the app name, icons, and `standalone` display mode.

## Static Hosting
This app can be deployed to any static site host:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **AWS S3**: Upload `dist/` and configure static website hosting.
