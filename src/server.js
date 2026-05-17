import express from 'express'
import * as Sentry from '@sentry/node'
import { CheckoutValidationError, quoteCart } from './checkout.js'
import { demoContext } from './demo-release.js'

const app = express()
const port = Number(process.env.PORT || 3000)

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  release: process.env.RELEASE_SHA || 'local',
  tracesSampleRate: 0,
})

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    ...demoContext(),
  })
})

app.get('/demo/context', (_req, res) => {
  res.json(demoContext())
})

app.post('/checkout/quote', (req, res) => {
  try {
    const cart = req.body?.cart
    const total = quoteCart(cart)
    res.json({ currency: 'USD', total, ...demoContext({ workflow: 'quote' }) })
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      res.status(400).json({
        error: error.code,
        message: error.message,
        details: error.details,
        ...demoContext({ workflow: 'quote-validation' }),
      })
      return
    }
    throw error
  }
})

app.post('/demo/production-error', (req, res) => {
  const demoRunOverride = req.body?.demoRunId || process.env.DEMO_RUN_ID
  const context = demoContext({
    ...(demoRunOverride ? { demoRunId: demoRunOverride } : {}),
    route: '/checkout/quote',
    workflow: 'production-regression',
  })
  const error = new Error(`Nimbus checkout production regression ${context.demoRunId}`)

  Sentry.withScope(scope => {
    scope.setTag('demo_run_id', context.demoRunId)
    scope.setTag('service', context.service)
    scope.setTag('component', context.component)
    scope.setTag('workflow', context.workflow)
    scope.setTag('route', context.route)
    scope.setFingerprint(['nimbus-checkout-regression', context.demoRunId])
    Sentry.captureException(error)
  })

  res.status(202).json({ captured: true, message: error.message, ...context })
})

app.listen(port, () => {
  console.log(`nimbus-checkout-api listening on ${port}`)
})
