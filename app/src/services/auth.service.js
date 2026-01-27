import * as authToken from "../authentication/token.js"
import * as authRepo from "../repositories/auth.repository.js";
import * as validator from "./validators/validator.js";
import argon2 from "argon2";

export const loginService = async (email, password, req) => {
  validator.emailValidator(email);
  validator.passwordValidator(password);

  const userRes = await authRepo.getUserByEmail(email);
  const user = userRes.rows[0];

  if (!user) throw new Error("User not found");
  const password_verified = await argon2.verify(user.password_hash, password);
  if (!password_verified) throw new Error("Password not found");

  const { accessToken, AT_expires_at } = authToken.signAccessToken(user);
  const refreshToken = authToken.generateRefreshToken();

  const { id: refreshId, RT_expires_at } = await authToken.saveRefreshToken({
    user,
    refreshToken,
    req,
  });

  return { accessToken, refreshToken, refreshId, AT_expires_at, RT_expires_at };
};