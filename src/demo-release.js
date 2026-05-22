export const liveDemoRunId = 'release-20260523-021933'

export function demoContext(overrides = {}) {
  return {
    demoRunId: process.env.DEMO_RUN_ID || liveDemoRunId,
    release: process.env.RELEASE_SHA || 'local',
    service: 'nimbus-checkout-api',
    component: 'checkout',
    workflow: overrides.workflow || 'checkout-validation',
  }
}