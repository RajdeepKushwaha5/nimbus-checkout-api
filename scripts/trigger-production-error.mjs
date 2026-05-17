import * as Sentry from '@sentry/node'
import { quoteCart } from '../src/checkout.js'
import { demoContext } from '../src/demo-release.js'

const context = demoContext({ workflow: 'null-cart-regression' })

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  release: context.release,
  tracesSampleRate: 0,
})

try {
  quoteCart(null)
} catch (error) {
  Sentry.withScope(scope => {
    scope.setTag('demo_run_id', context.demoRunId)
    scope.setTag('service', context.service)
    scope.setTag('component', context.component)
    scope.setTag('workflow', context.workflow)
    scope.setFingerprint(['nimbus-null-cart-regression', context.demoRunId])
    Sentry.captureException(error)
  })
  console.error(error.message)
}

await Sentry.flush(3000)
