import crypto from "crypto";

// api key format: "<agentId>.<secret>" — the id lets us look the agent up
// without scanning the table; only the secret half is ever hashed/stored.
export function generateApiKey(agentId: string) {
  const secret = crypto.randomBytes(24).toString("hex");
  return { apiKey: `${agentId}.${secret}`, secret };
}

export function hashSecret(secret: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(secret, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifySecret(secret: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const check = crypto.scryptSync(secret, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(check, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function parseApiKey(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const key = authHeader.slice("Bearer ".length).trim();
  const dot = key.indexOf(".");
  if (dot === -1) return null;
  return { agentId: key.slice(0, dot), secret: key.slice(dot + 1) };
}
