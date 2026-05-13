import express from 'express'
import * as Sentry from '@sentry/node'
import { quoteCart } from './checkout.js'

const app = express()
const port = Number(process.env.PORT || 3000)

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  release: process.env.RELEASE_SHA || 'local',
  tracesSampleRate: 0,
})

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'nimbus-checkout-api' })
})

app.post('/checkout/quote', (req, res) => {
  const cart = req.body?.cart
  const total = quoteCart(cart)
  res.json({ currency: 'USD', total })
})

app.listen(port, () => {
  console.log(`nimbus-checkout-api listening on ${port}`)
})
