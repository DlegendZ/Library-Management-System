import jwt from "jsonwebtoken";
import crypto from "crypto";
import { query } from "../../database.js";

export function signAccessToken(user) {
  const accessToken = jwt.sign(
    { user_id: user.user_id, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const decoded = jwt.decode(accessToken);
  const AT_expires_at = new Date(Date.now() + decoded.exp * 1000);

  return { accessToken, AT_expires_at };
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function sha256(refreshToken) {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
}

export async function saveRefreshToken({ user, refreshToken, req }) {
  const id = crypto.randomUUID();
  const token_hash = sha256(refreshToken);

  const RT_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      id,
      user.user_id,
      token_hash,
      RT_expires_at,
      req.ip,
      req.headers["user-agent"] || null,
    ]
  );

  return { id, RT_expires_at };
}

export async function findRefreshToken(refreshToken) {
  const token_hash = sha256(refreshToken);

  const result = await query(
    `SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
    [token_hash]
  );

  return result.rows[0] || null;
}

export async function revokeRefreshToken(id) {
  await query(`DELETE FROM refresh_tokens WHERE id = $1`, [id]);
}
