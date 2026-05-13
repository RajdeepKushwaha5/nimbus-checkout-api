# Nimbus Checkout API

Small checkout service used to validate payment quote behavior and production error telemetry.

## Run

```bash
npm install
cp .env.example .env
npm start
```

## Demo Flow

1. Merge a PR that changes checkout validation.
2. Run `npm run trigger:error` with `SENTRY_DSN` set.
3. Helm joins the merged GitHub PR with the first-seen Sentry error.

For a live recording run, use Helm's local `scripts/run-live-demo.ps1` helper. It creates a fresh PR, merges it, emits a uniquely fingerprinted Sentry error, then polls Helm until the Coral join returns the new evidence row.

The repo intentionally contains no secrets. Runtime credentials live in local environment variables.
