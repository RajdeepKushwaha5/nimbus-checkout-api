// inventory.js
const MAX_RETRIES = 3;

export async function decrementStock(db, itemId, qty) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const item = await db.find("inventory", { id: itemId });
    if (!item || item.stock < qty) {
      throw new Error(`Insufficient stock for item ${itemId}`);
    }
    const updated = await db.updateWhere(
      "inventory",
      { id: itemId, version: item.version },
      { stock: item.stock - qty, version: item.version + 1 }
    );
    if (updated) return true;
  }
  throw new Error("Inventory update conflict after retries — possible oversell condition");
}
