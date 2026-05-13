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

The repo intentionally contains no secrets. Runtime credentials live in local environment variables.
