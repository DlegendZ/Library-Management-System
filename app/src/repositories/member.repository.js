import { query } from "../../database.js";

export const getBooks = async () => {
  return await query(
    `SELECT * FROM books b JOIN categories c
        ON b.category_id = c.category_id`
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
    [user_id]
  );
};

export const getMyFineStatus = async (user_id) => {
  return await query(
    `SELECT * FROM users u LEFT JOIN  borrow_records br 
        ON u.user_id = br.user_id LEFT JOIN fine_records fr
        ON br.borrow_id = fr.borrow_id WHERE u.user_id = $1 AND fr.status IN ('unpaid', 'partial')`,
    [user_id]
  );
};
