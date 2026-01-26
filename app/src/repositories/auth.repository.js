import { query } from "../../database.js";

export const getUserByEmail = async (email) => {
  return await query(`SELECT * FROM users WHERE email = $1`, [
    email.toLowerCase(),
  ]);
};