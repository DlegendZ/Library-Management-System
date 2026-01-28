import { query } from "../../database.js";

export const getBooks = async () => {
  return await query(
    `SELECT * FROM books b JOIN categories c
        ON b.category_id = c.category_id`,
  );
};

export const borrowBook = async (user_id, book_id) => {
  return await query(
    `INSERT INTO borrow_records (user_id, book_id, due_at) VALUES 
        ($1, $2, NOW() + INTERVAL '14 days')`,
    [user_id, book_id],
  );
};

export const returnBook = async (borrow_id) => {
  return await query(
    `UPDATE borrow_records SET returned_at = NOW(), status = '' WHERE borrow_id = $1`,
    [borrow_id],
  );
};

export const getBooksByCategory = async (categoryId) => {
  return await query(`SELECT * FROM books WHERE category_id = $1`, [
    categoryId,
  ]);
};

export const getBooksByTitle = async (title) => {
  return await query(`SELECT * FROM books WHERE title = $1`, [title]);
};

export const getBooksByAuthor = async (author) => {
  return await query(`SELECT * FROM books WHERE author = $1`, [author]);
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
        ON br.borrow_id = fr.borrow_id WHERE u.user_id = $1 AND fr.status = $2`,
    [user_id, status],
  );
};

export const getMyStatus = async (user_id) => {
  return await query(`SELECT status FROM users WHERE user_id = $1`, [user_id]);
};

export const getMyBorrowBooksCount = async (user_id) => {
  return await query(
    `SELECT COUNT(*) FROM borrow_records WHERE user_id = $1 `,
    [user_id],
  );
};

export const getMyBookStatus = async (book_id) => {
  return await query(`SELECT status FROM books WHERE book_id = $1`, [book_id]);
};

export const getMyBorrowedBooks = async (user_id, book_id) => {
  return await query(
    `SELECT COUNT(*) FROM borrow_records WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'`,
    [user_id, book_id],
  );
};

export const getMyUnpaidFines = async (user_id) => {
  return await query(
    `SELECT SUM(amount - paid_amount) FROM users u LEFT JOIN  borrow_records br 
        ON u.user_id = br.user_id LEFT JOIN fine_records fr
        ON br.borrow_id = fr.borrow_id WHERE u.user_id = $1 AND fr.status IN ('unpaid', 'partial')`,
    [user_id],
  );
};
