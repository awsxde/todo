// ️️️✅ Best Practice: Use services for scoped and specific pieces of business logic
function determinePaymentTerms(requestedTerms: number, userId: number) {
  // In real-world app, more logic and even integrations will come here
  return requestedTerms + userId || 30;
}

export default { determinePaymentTerms };
