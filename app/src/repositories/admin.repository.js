import { query } from "../../database.js";

export const insertLibrarian = async (full_name, email, password_hash) => {
  return await query(
    `INSERT INTO users (role_id, full_name, email, password_hash)
        VALUES ($1, $2, $3, $4) RETURNING *`,
    [2, full_name, email, password_hash]
  );
};

export const updateRoles = async (user_id, role_id) => {
  return await query(
    `UPDATE users SET role_id = $1 WHERE user_id = $2 RETURNING *`,
    [role_id, user_id]
  );
};

export const updateStatus = async (user_id, status) => {
  return await query(
    `UPDATE users SET status = $1 WHERE user_id = $2 RETURNING *`,
    [status, user_id]
  );
};

export const getAllUsers = async () => {
  return await query(`SELECT * FROM users`);
};

export const getRolesAssignments = async () => {
  return await query(`SELECT * FROM roles`);
};

export const getBooks = async () => {
  return await query(`SELECT * FROM books`);
};

export const getCategories = async () => {
  return await query(`SELECT * FROM categories`);
};

export const getBorrowRecords = async () => {
  return await query(
    `SELECT * FROM users u LEFT JOIN borrow_records br 
        ON u.user_id = br.user_id RIGHT JOIN books b
        ON b.book_id = br.book_id`
  );
};

export const getFineRecords = async () => {
  return await query(
    `SELECT * FROM fine_records fr RIGHT JOIN borrow_records br 
        ON fr.borrow_id = br.borrow_id RIGHT JOIN users u 
        ON br.user_id = u.user_id RIGHT JOIN books b
        ON b.book_id = br.book_id`
  );
};

export const getMemberBorrowHistory = async (user_id) => {
  return await query(
    `SELECT * FROM 
        users u LEFT JOIN borrow_records br 
        ON u.user_id = br.user_id RIGHT JOIN books b
        ON br.book_id = b.book_id
        WHERE u.role_id = 3 AND u.user_id = $1`,
    [user_id]
  );
};

export const getBooksWithBorrowers = async (status) => {
  return await query(
    `SELECT * FROM 
        books b LEFT JOIN borrow_records br 
        ON b.book_id = br.book_id RIGHT JOIN
        users u ON u.user_id = br.user_id
        WHERE br.status = $1`,
    [status]
  );
};

export const getUsersWithFines = async (status) => {
  return await query(
    `SELECT * FROM 
        fine_records fr RIGHT JOIN borrow_records br 
        ON fr.borrow_id = br.borrow_id LEFT JOIN
        users u ON u.user_id = br.user_id
        WHERE fr.status = $1`,
    [status]
  );
};

export const getUserByStatus = async (status) => {
  return await query(`SELECT * FROM users WHERE status = $1`, [status]);
};

export const insertBook = async (
  category_id,
  isbn,
  title,
  author,
  total_copies,
  available_copies
) => {
  return await query(
    `INSERT INTO books 
        (category_id, isbn, title, author, total_copies, available_copies)
        VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [category_id, isbn, title, author, total_copies, available_copies]
  );
};

export const updateBook = async (
  book_id,
  category_id,
  isbn,
  title,
  author,
  total_copies,
  available_copies,
  status
) => {
  return await query(
    `UPDATE books SET 
            category_id = $1,
            isbn = $2,
            title = $3,
            author = $4,
            total_copies = $5,
            available_copies = $6,
            status = $7
        WHERE book_id = $8`,
    [
      category_id,
      isbn,
      title,
      author,
      total_copies,
      available_copies,
      status,
      book_id,
    ]
  );
};

export const deleteBook = async (book_id) => {
  return await query(`DELETE FROM books WHERE book_id = $1`, [book_id]);
};

export const insertCategory = async (name, description) => {
  return await query(
    `INSERT INTO category (name, description) VALUES ($1, $2)`,
    [name, description]
  );
};

export const updateCategory = async (name, description) => {
  return await query(`UPDATE category SET name = $1, description = $2`, [
    name,
    description,
  ]);
};
