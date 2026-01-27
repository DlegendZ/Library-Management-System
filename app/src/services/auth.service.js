// import * as authToken from "../authentication/token.js";
import * as authRepo from "../repositories/auth.repository.js";
import * as validator from "./validators/validator.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export function signAccessToken(user) {
  const accessToken = jwt.sign(
    { user_id: user.user_id, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
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

  await authRepo.InsertRefreshToken(
    id,
    user.user_id,
    token_hash,
    RT_expires_at,
    req.ip,
    req.headers["user-agent"] || null
  );

  return { id, RT_expires_at };
}

export async function findRefreshToken(refreshToken) {
  const token_hash = sha256(refreshToken);

  const result = await authRepo.findRefreshToken(token_hash);

  return result.rows[0] || null;
}

export async function revokeRefreshToken(id) {
  await authRepo.revokeRefreshToken(id);
}

export const loginService = async (email, password, req) => {
  validator.emailValidator(email);
  validator.passwordValidator(password);

  const userRes = await authRepo.getUserByEmail(email);
  const user = userRes.rows[0];

  if (!user) throw new Error("User not found");
  const password_verified = await argon2.verify(user.password_hash, password);
  if (!password_verified) throw new Error("Password not found");

  const { accessToken, AT_expires_at } = signAccessToken(user);
  const refreshToken = generateRefreshToken();

  const { id: refreshId, RT_expires_at } = await saveRefreshToken({
    user,
    refreshToken,
    req,
  });

  return { accessToken, refreshToken, refreshId, AT_expires_at, RT_expires_at };
};
