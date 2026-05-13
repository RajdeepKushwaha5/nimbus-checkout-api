export function quoteCart(cart) {
  if (!Array.isArray(cart?.items)) {
    return 0
  }

  return cart.items.reduce((sum, item) => {
    const quantity = Number(item.quantity || 0)
    const price = Number(item.price || 0)
    return sum + quantity * price
  }, 0)
}