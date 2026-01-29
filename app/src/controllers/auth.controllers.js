import * as authService from "../services/auth.service.js";
import { query } from "../../database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const {
      accessToken,
      refreshToken,
      refreshId,
      AT_expires_at,
      RT_expires_at,
    } = await authService.loginService(email, password, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: RT_expires_at,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: AT_expires_at,
    });

    return res.status(200).json({ message: "Login successful." });
  } catch (err) {
    console.error("error :", err);
    if (err.status || err.message === "User not found") {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refATController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ error: "Refresh token not found" });
  const row = await authService.findRefreshToken(refreshToken);
  if (!row) return res.status(401).json({ error: "Invalid refresh token" });

  try {
    const userRes = await query(`SELECT * FROM users WHERE user_id = $1`, [
      row.user_id,
    ]);
    const user = userRes.rows[0];
    const { accessToken, AT_expires_at } = authService.signAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: AT_expires_at,
    });

    return res.status(200).json({ message: "New access token issued." });
  } catch (err) {
    console.log("error :", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  try {
    if (refreshToken) {
      const row = await authService.findRefreshToken(refreshToken);
      if (row) await authService.revokeRefreshToken(row.id);
      res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 0,
      });

      res.status(200).json({ message: "Logged out" });
    } else {
      res.status(400).json({ message: "Required refresh token" });
    }
  } catch (err) {
    console.error("Error : ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new Error("Refresh token not found");
  const row = await authService.findRefreshToken(refreshToken);
  if (!row) throw new Error("Invalid refresh token");

  const userRes = await query(`SELECT * FROM users WHERE user_id = $1`, [
    row.user_id,
  ]);
  const user = userRes.rows[0];
  const { accessToken, AT_expires_at } = authService.signAccessToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: AT_expires_at,
  });

  return accessToken;
};

export const requireAccessTokenController = async (req, res, next) => {
  try {
    let accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      accessToken = await refreshAccessToken(req, res);
    }
    const { user_id, role_id } = jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
    );
    req.user = { user_id, role_id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role_id === 1) return next();
  return res.status(401).json({ message: "unauthorized" });
};

export const requireLibrarian = (req, res, next) => {
  if (req.user.role_id === 2) return next();
  return res.status(401).json({ message: "unauthorized" });
};

export const requireMember = (req, res, next) => {
  if (req.user.role_id === 3) return next();
  return res.status(401).json({ message: "unauthorized" });
};
