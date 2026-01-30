import { query } from "../../database.js";

export const insertMember = async (full_name, email, password_hash) => {
  return await query(
    `INSERT INTO users (role_id, u_full_name, u_email, u_password_hash) VALUES
        ($1,$2,$3,$4) RETURNING *`,
    [3, full_name, email.toLowerCase(), password_hash]
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
        (category_id, b_isbn, b_title, b_author, b_total_copies, b_available_copies)
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
            b_isbn = $2,
            b_title = $3,
            b_author = $4,
            b_total_copies = $5,
            b_available_copies = $6,
            b_status = $7
        WHERE book_id = $8 RETURNING *`,
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

export const memberPayFinesRepo = async (borrow_id, amount) => {
  return await query(
    `UPDATE fine_records SET fr_paid_amount = fr_paid_amount + $1 WHERE borrow_id = $2 RETURNING *`,
    [amount, borrow_id],
  );
};
