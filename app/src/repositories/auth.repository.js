import { query } from "../../database.js";

export const getUserByEmail = async (email) => {
  return await query(`SELECT * FROM users WHERE email = $1`, [
    email.toLowerCase(),
  ]);
};

export const InsertRefreshToken = async (
  uuid,
  user_id,
  token_hash,
  expires_at,
  ip,
  headers,
) => {
  await query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [uuid, user_id, token_hash, expires_at, ip, headers],
  );
};

export const findRefreshToken = async (token_hash) => {
  await query(
    `SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
    [token_hash],
  );
};

export const revokeRefreshToken = async(id) => {
  await query(`DELETE FROM refresh_tokens WHERE id = $1`, [id]);
}
