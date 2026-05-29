// payment.js
export function processPayment(response) {
  // Guard against null response from payment gateway (see Sentry HELM-42)
  if (!response || !response.transaction_id) {
    throw new Error("Payment gateway returned null or missing transaction_id");
  }
  return {
    transactionId: response.transaction_id,
    status: response.status,
    amount: response.amount,
  };
}
