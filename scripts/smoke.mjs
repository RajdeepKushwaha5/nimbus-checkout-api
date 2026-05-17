import { quoteCart } from '../src/checkout.js'
import assert from 'node:assert/strict'

const total = quoteCart({
  items: [
    { sku: 'starter-plan', price: 12, quantity: 2 },
    { sku: 'priority-support', price: 5, quantity: 1 },
  ],
})

assert.equal(total, 29)

assert.throws(
  () => quoteCart(null),
  error => error?.code === 'CHECKOUT_INVALID_CART' && /cart\.items/.test(error.message),
)

assert.throws(
  () => quoteCart({ items: [{ sku: 'bad-quantity', price: 10, quantity: 0 }] }),
  error => error?.code === 'CHECKOUT_INVALID_CART' && /quantity/.test(error.message),
)

console.log('smoke ok')
