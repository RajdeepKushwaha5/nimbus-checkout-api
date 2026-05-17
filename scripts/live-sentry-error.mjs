import * as Sentry from '@sentry/node'
import { demoContext } from '../src/demo-release.js'

const context = demoContext({ workflow: 'live-pr-to-sentry-join' })

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  release: context.release,
  tracesSampleRate: 0,
})

const error = new Error(`Live checkout regression ${context.demoRunId}`)

Sentry.withScope(scope => {
  scope.setTag('demo_run_id', context.demoRunId)
  scope.setTag('service', context.service)
  scope.setTag('component', context.component)
  scope.setTag('workflow', context.workflow)
  scope.setFingerprint(['live-checkout-regression', context.demoRunId])
  Sentry.captureException(error)
})

console.error(error.message)
await Sentry.flush(5000)
