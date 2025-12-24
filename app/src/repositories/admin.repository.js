import { query } from "../../database.js"

export const registerLibrarian = async(role_id, full_name, email, password_hash) => {
    return await query(
        `INSERT INTO users (role_id, full_name, email, password_hash)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [role_id, full_name, email, password_hash]
    );
};

export const assignRoles = async(user_id, role_id) => {
    return await query(
        `UPDATE users SET role_id = $1 WHERE user_id = $2 RETURNING *`,
        [role_id, user_id]
    );
};

export const viewAllUsers = async() => {
    return await query(
        `SELECT * FROM users`
    );
}

export const updateStatus = async(user_id, status) => {
    return await query(
        `UPDATE users SET status = $1 WHERE user_id = $2`,
        [status, user_id]
    );
};

