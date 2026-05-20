export class CheckoutValidationError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.name = 'CheckoutValidationError'
    this.code = 'CHECKOUT_INVALID_CART'
    this.details = details
  }
}

function assertFiniteMoney(value, path) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) {
    throw new CheckoutValidationError(`${path} must be a non-negative number`, { path })
  }
  return amount
}

function assertPositiveQuantity(value, path) {
  const quantity = Number(value)
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new CheckoutValidationError(`${path} must be a positive integer`, { path })
  }
  return quantity
}

export function normalizeCart(cart) {
  if (!cart || !Array.isArray(cart.items)) {
    throw new CheckoutValidationError('cart.items is required', { path: 'cart.items' })
  }

  return {
    items: cart.items.map((item, index) => ({
      sku: String(item.sku || `line-${index + 1}`),
      quantity: assertPositiveQuantity(item.quantity, `cart.items[${index}].quantity`),
      price: assertFiniteMoney(item.price, `cart.items[${index}].price`),
    })),
  }
}

export function quoteCart(cart) {
  const normalized = normalizeCart(cart)
  const total = normalized.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  return Number(total.toFixed(2))
}