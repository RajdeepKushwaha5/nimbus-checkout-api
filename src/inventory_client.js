// inventory_client.js — retries with exponential back-off
const BASE_DELAY = 200;
const MAX_RETRIES = 3;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchInventory(itemId) {
  let lastError;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(`/api/inventory/${itemId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastError = e;
      const delay = BASE_DELAY * 2 ** i + Math.random() * 50;
      await sleep(delay);
    }
  }
  throw new Error(`Inventory fetch failed after ${MAX_RETRIES} retries: ${lastError?.message}`);
}
