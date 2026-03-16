# AI Atlas

Beginner-friendly AI tool recommendation app with a React frontend and a hardened Node API.

## Architecture

- Frontend: Vite + React (`src/`)
- Backend: Node HTTP server (`server.js`)
- API endpoint: `POST /api/recommend`
- Health check: `GET /healthz`
- Production static serving: when `dist/index.html` exists, `server.js` serves the SPA and static assets.

## Requirements

- Node.js 22+
- An Anthropic API key

## Environment Variables

- `ANTHROPIC_API_KEY` (required for live recommendations)
- `PORT` (default: `3001`)
- `ALLOWED_ORIGINS` comma-separated list for API CORS (default local Vite origins)
- `REQUEST_TIMEOUT_MS` (default: `25000`)
- `RATE_LIMIT_WINDOW_MS` (default: `60000`)
- `RATE_LIMIT_MAX_REQUESTS` (default: `40`)
- `MAX_BODY_BYTES` (default: `16384`)
- `ANTHROPIC_MAX_TOKENS` (default: `1200`, capped at `1400`)
- `ENABLE_WEB_SEARCH` (default: `false`; enable only if you can tolerate slower responses)
- `TRUST_PROXY` (`true` only when behind a trusted proxy/load balancer)
- `STATIC_DIR` (optional override for built frontend directory, default `./dist`)

## Local Development

1. Install:

```bash
npm install
```

2. Start frontend:

```bash
npm run dev
```

3. Start API server (second terminal):

```bash
npm run server
```

Frontend dev server proxies `/api` to `http://localhost:3001`.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Or run all in sequence:

```bash
npm run ci
```

## Production (Single Process)

Build and run:

```bash
npm install --omit=dev
npm run build
npm run server
```

With `dist/` present, `server.js` serves both:

- Static frontend routes/assets
- API routes under `/api/*`

## Production (Vercel + GitHub)

This repo is now Vercel-ready with:

- `api/recommend.js` as a serverless API function
- `vercel.json` configured for Vite build output (`dist/`) and SPA fallback routing

### Required Vercel Environment Variables

Set these in Vercel:

- `ANTHROPIC_API_KEY=...` (required)
- `TRUST_PROXY=true`
- `REQUEST_TIMEOUT_MS=25000`
- `RATE_LIMIT_WINDOW_MS=60000`
- `RATE_LIMIT_MAX_REQUESTS=40`
- `MAX_BODY_BYTES=16384`
- `ANTHROPIC_MAX_TOKENS=1200`
- `ENABLE_WEB_SEARCH=false`
- `ALLOWED_ORIGINS`:
  - Production: `https://ai-atlas-eosin.vercel.app`
  - Preview: use the preview deployment URL for that environment
  - Development: `http://localhost:5173,http://127.0.0.1:5173`

Notes:
- Do **not** set `PORT` on Vercel.
- If you add a custom domain later, append it to `ALLOWED_ORIGINS` as a comma-separated value.

### Deploy Flow

1. Push this repository to GitHub.
2. In Vercel, import the GitHub repo and keep defaults:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add the environment variables above.
4. Trigger deploy from Vercel (or push to your default branch if auto-deploy is enabled).
5. Verify:
   - Frontend loads at [https://ai-atlas-eosin.vercel.app](https://ai-atlas-eosin.vercel.app)
   - `POST /api/recommend` succeeds from the deployed frontend

## Production (Docker)

Build image:

```bash
docker build -t ai-atlas:latest .
```

Run container:

```bash
docker run --rm -p 3001:3001 --env-file .env ai-atlas:latest
```

Check health:

```bash
curl http://localhost:3001/healthz
```

## Security Notes

- API payload is validated with `zod`.
- Body size limits, request timeout, and in-memory rate limiting are enabled.
- CORS is allowlist-based for `/api/*`.
- Structured request IDs are returned via `X-Request-Id`.
- Static file serving blocks path traversal outside the configured static root.
