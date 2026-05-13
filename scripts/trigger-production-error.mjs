import * as Sentry from '@sentry/node'
import { quoteCart } from '../src/checkout.js'

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  release: process.env.RELEASE_SHA || 'local',
  tracesSampleRate: 0,
})

try {
  quoteCart(null)
  throw new Error('Checkout quote regression: null cart accepted unexpectedly')
} catch (error) {
  Sentry.captureException(error)
  console.error(error.message)
}

await Sentry.flush(3000)
