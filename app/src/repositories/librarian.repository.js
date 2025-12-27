import { query } from "../../database.js";

export const insertMember = async (full_name, email, password_hash) => {
  return await query(
    `INSERT INTO users (role_id, full_name, email, password_hash) VALUES
        ($1,$2,$3,$4) RETURNING *`,
    [3, full_name, email, password_hash]
  );
};

export const getAllMembers = async () => {
  return await query(`SELECT * FROM users WHERE role_id = 3`);
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

export const borrowBook = async (user_id, book_id, due_at) => {
  return await query(
    `INSERT INTO borrow_records (user_id, book_id, due_at) VALUES 
        ($1, $2, $3)`,
    [user_id, book_id, due_at]
  );
};

export const returnBook = async (borrow_id) => {
  return await query(
    `UPDATE borrow_records SET returned_at = NOW() WHERE borrow_id = $1`,
    [borrow_id]
  );
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
