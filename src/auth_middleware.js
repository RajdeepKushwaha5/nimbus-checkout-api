// auth_middleware.js
import jwt from "jsonwebtoken";

export function requireValidJwt(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Extra check: reject tokens within 30s of expiry to prevent race on long checkouts
    if (payload.exp - Date.now() / 1000 < 30) {
      return res.status(401).json({ error: "Token expiring too soon — please re-authenticate" });
    }
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: `JWT validation failed: ${e.message}` });
  }
}
