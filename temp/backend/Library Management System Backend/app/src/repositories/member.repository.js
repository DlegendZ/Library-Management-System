import { query } from "../../database.js";

export const getBooks = async () => {
  return await query(
    `SELECT * FROM books b JOIN categories c
        ON b.category_id = c.category_id`,
  );
};

export const borrowBook = async (user_id, book_id) => {
  return await query(
    `INSERT INTO borrow_records (user_id, book_id, br_due_at) VALUES 
        ($1, $2, NOW() + INTERVAL '14 days') RETURNING *`,
    [user_id, book_id],
  );
};

export const returnBook = async (user_id, borrow_id) => {
  return await query(
    `UPDATE borrow_records SET br_returned_at = NOW() WHERE borrow_id = $1 AND user_id = $2 RETURNING *`,
    [borrow_id, user_id],
  );
};

export const getBooksByCategory = async (category_name) => {
  return await query(
    `SELECT * FROM books INNER JOIN categories ON books.category_id = categories.category_id WHERE c_name = $1`,
    [category_name],
  );
};

export const getBooksByTitle = async (title) => {
  return await query(`SELECT * FROM books WHERE b_title = $1`, [title]);
};

export const getBooksByAuthor = async (author) => {
  return await query(`SELECT * FROM books WHERE b_author = $1`, [author]);
};

export const getMyBorrowHistory = async (user_id) => {
  return await query(
    `SELECT * FROM 
        users u LEFT JOIN borrow_records br 
        ON u.user_id = br.user_id RIGHT JOIN books b
        ON br.book_id = b.book_id
        WHERE u.role_id = 3 AND u.user_id = $1`,
    [user_id],
  );
};

export const getMyFineStatus = async (user_id, status) => {
  return await query(
    `SELECT * FROM users u LEFT JOIN  borrow_records br 
        ON u.user_id = br.user_id LEFT JOIN fine_records fr
        ON br.borrow_id = fr.borrow_id RIGHT JOIN books b ON b.book_id = br.book_id WHERE u.user_id = $1 AND fr.fr_status = $2`,
    [user_id, status],
  );
};

export const getMyStatus = async (user_id) => {
  return await query(`SELECT u_status FROM users WHERE user_id = $1`, [
    user_id,
  ]);
};

export const getMyBorrowBooksCount = async (user_id) => {
  return await query(
    `SELECT COUNT(*) FROM borrow_records WHERE user_id = $1 AND br_status = 'borrowed'`,
    [user_id],
  );
};

export const findMyBook = async (book_id) => {
  return await query(`SELECT * FROM books WHERE book_id = $1`, [book_id]);
};

export const getMyBookStatus = async (book_id) => {
  return await query(`SELECT b_status FROM books WHERE book_id = $1`, [
    book_id,
  ]);
};

export const getMyBorrowedBooks = async (user_id, book_id) => {
  return await query(
    `SELECT COUNT(*) FROM borrow_records WHERE user_id = $1 AND book_id = $2 AND br_status = 'borrowed'`,
    [user_id, book_id],
  );
};

export const getMyUnpaidFines = async (user_id) => {
  return await query(
    `SELECT SUM(fr_amount - fr_paid_amount) FROM users u LEFT JOIN  borrow_records br 
        ON u.user_id = br.user_id LEFT JOIN fine_records fr
        ON br.borrow_id = fr.borrow_id WHERE u.user_id = $1 AND fr.fr_status IN ('unpaid', 'partial')`,
    [user_id],
  );
};
