# Nimbus Checkout API

Small checkout service used to validate payment quote behavior and production error telemetry.
It is intentionally simple, but the responses and Sentry tags are shaped for
Coral demos where Helm joins GitHub pull requests to Sentry production errors.

## Run

```bash
npm install
cp .env.example .env
npm start
```

## Local Smoke Test

```bash
npm run smoke
```

The smoke test proves:

- valid quote math still works
- malformed carts are rejected with `CHECKOUT_INVALID_CART`
- invalid quantities do not silently become zero-dollar checkout lines

## Useful Endpoints

```bash
curl http://127.0.0.1:3000/health
```

```bash
curl -X POST http://127.0.0.1:3000/checkout/quote \
  -H "Content-Type: application/json" \
  -d "{\"cart\":{\"items\":[{\"sku\":\"starter-plan\",\"price\":12,\"quantity\":2},{\"sku\":\"priority-support\",\"price\":5,\"quantity\":1}]}}"
```

```bash
curl -X POST http://127.0.0.1:3000/demo/production-error \
  -H "Content-Type: application/json" \
  -d "{\"demoRunId\":\"demo-local\"}"
```

`/demo/production-error` returns immediately and emits a Sentry event when
`SENTRY_DSN` is configured. The event includes these tags:

- `demo_run_id`
- `service=nimbus-checkout-api`
- `component=checkout.quote`
- `workflow=production-regression`
- `route=/checkout/quote`

## Demo Flow

1. Merge a PR that changes checkout validation.
2. Run `npm run trigger:error` with `SENTRY_DSN` set.
3. Helm joins the merged GitHub PR with the first-seen Sentry error.

For a live recording run, use Helm's local `scripts/run-live-demo.ps1` helper. It creates a fresh PR, merges it, emits a uniquely fingerprinted Sentry error, then polls Helm until the Coral join returns the new evidence row.

For a manual GitHub PR demo, use the state switcher:

```bash
npm run demo:regress
npm run smoke # should fail while the regression is present
git checkout -b release/demo-checkout-regression
git add src/checkout.js
git commit -m "Release checkout validation regression"
```

After Helm finds the regression, restore the fix:

```bash
npm run demo:fix
npm run smoke
git checkout -b fix/checkout-validation
git add src/checkout.js
git commit -m "Restore checkout validation"
```

The repo intentionally contains no secrets. Runtime credentials live in local environment variables.
