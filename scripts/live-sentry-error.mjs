import * as Sentry from '@sentry/node'
import { liveDemoRunId } from '../src/demo-release.js'

const runId = process.env.DEMO_RUN_ID || liveDemoRunId || new Date().toISOString()
const release = process.env.RELEASE_SHA || 'local'

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  release,
  tracesSampleRate: 0,
})

const error = new Error(`Live checkout regression ${runId}`)

Sentry.withScope(scope => {
  scope.setTag('demo_run_id', runId)
  scope.setTag('service', 'nimbus-checkout-api')
  scope.setFingerprint(['live-checkout-regression', runId])
  Sentry.captureException(error)
})

console.error(error.message)
await Sentry.flush(5000)
