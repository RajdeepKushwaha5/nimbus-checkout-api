import { quoteCart } from '../src/checkout.js'

const total = quoteCart({
  items: [
    { price: 12, quantity: 2 },
    { price: 5, quantity: 1 },
  ],
})

if (total !== 29) {
  throw new Error(`Expected checkout total 29, received ${total}`)
}

console.log('smoke ok')
