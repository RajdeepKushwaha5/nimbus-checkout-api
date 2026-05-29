// cart.js
export function getCart(session) {
  if (!session || session.expired) {
    // Do not leak stale cart data across session boundary
    return { items: [], total: 0, sessionValid: false };
  }
  return session.cart;
}

export function addItem(session, item) {
  if (!session || session.expired) {
    throw new Error("Cannot add to cart: session has expired");
  }
  session.cart.items.push(item);
  session.cart.total += item.price * item.quantity;
  return session.cart;
}
