import * as authService from "../services/auth.service.js";
// import * as authToken from "../authentication/token.js";
import { query } from "../../database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({path: "../../.env"});

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken, refreshId, AT_expires_at, RT_expires_at } =
      await authService.loginService(email, password, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: RT_expires_at
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: AT_expires_at
    });

    return res.status(200).json({ accessToken, refreshId });
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
    const accessToken = authService.signAccessToken(user);
    return res.status(200).json({ accessToken });
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
      res.status(200).json({ message: "Required refresh token" });
    }
  } catch (err) {
    console.error("Error : ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const requireAccessTokenController = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) return res.status(401).json({message: "unauthorized"});
  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    next();
  }
  catch (err) {
    return res.status(401).json({message: "unauthorized"});
  }
}