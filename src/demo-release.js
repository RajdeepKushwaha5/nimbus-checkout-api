export const liveDemoRunId = 'demo-20260514-041031'

export function demoContext(overrides = {}) {
  return {
    service: 'nimbus-checkout-api',
    component: 'checkout.quote',
    environment: process.env.NODE_ENV || 'production-demo',
    release: process.env.RELEASE_SHA || 'local',
    demoRunId: process.env.DEMO_RUN_ID || liveDemoRunId,
    ...overrides,
  }
}
