import { query } from "../../database.js";

export const registerAdmin = async (full_name, email, password_hash) => {
  return await query(
    `INSERT INTO users (role_id, u_full_name, u_email, u_password_hash)
        VALUES ($1, $2, $3, $4) RETURNING *`,
    [1, full_name, email.toLowerCase(), password_hash],
  );
};

export const insertLibrarian = async (full_name, email, password_hash) => {
  return await query(
    `INSERT INTO users (role_id, u_full_name, u_email, u_password_hash)
        VALUES ($1, $2, $3, $4) RETURNING *`,
    [2, full_name, email.toLowerCase(), password_hash],
  );
};

export const updateRoles = async (user_id, role_id) => {
  return await query(
    `UPDATE users SET role_id = $1 WHERE user_id = $2 RETURNING *`,
    [role_id, user_id],
  );
};

export const updateStatus = async (user_id, status) => {
  return await query(
    `UPDATE users SET u_status = $1 WHERE user_id = $2 RETURNING *`,
    [status, user_id],
  );
};

export const getAllUsers = async () => {
  return await query(`SELECT * FROM users`);
};

// export const getUserByEmail = async (email) => {
//   return await query(`SELECT * FROM users WHERE email = $1`, [
//     email.toLowerCase(),
//   ]);
// };

export const getRolesAssignments = async () => {
  return await query(`SELECT * FROM roles`);
};

export const getBooks = async () => {
  return await query(
    `SELECT * FROM books INNER JOIN categories ON books.category_id = categories.category_id WHERE b_is_deleted = false`,
  );
};

export const getCategories = async () => {
  return await query(`SELECT * FROM categories`);
};

export const getBorrowRecords = async () => {
  return await query(
    `SELECT * FROM users u JOIN borrow_records br 
        ON u.user_id = br.user_id JOIN books b
        ON b.book_id = br.book_id`,
  );
};

export const getFineRecords = async () => {
  return await query(
    `SELECT * FROM fine_records fr JOIN borrow_records br 
        ON fr.borrow_id = br.borrow_id JOIN users u 
        ON br.user_id = u.user_id JOIN books b
        ON b.book_id = br.book_id`,
  );
};

export const getMemberBorrowHistory = async (user_id) => {
  return await query(
    `SELECT * FROM 
        users u LEFT JOIN borrow_records br 
        ON u.user_id = br.user_id RIGHT JOIN books b
        ON br.book_id = b.book_id
        WHERE u.role_id = 3 AND u.user_id = $1`,
    [user_id],
  );
};

export const getBooksWithBorrowers = async (status) => {
  return await query(
    `SELECT * FROM 
        books b JOIN borrow_records br 
        ON b.book_id = br.book_id JOIN
        users u ON u.user_id = br.user_id
        WHERE br.br_status = $1`,
    [status],
  );
};

export const getUsersWithFines = async (status) => {
  return await query(
    `SELECT * FROM 
        fine_records fr JOIN borrow_records br 
        ON fr.borrow_id = br.borrow_id JOIN
        users u ON u.user_id = br.user_id JOIN books b
        ON b.book_id = br.book_id
        WHERE fr.fr_status = $1`,
    [status],
  );
};

export const getUserByStatus = async (status) => {
  return await query(`SELECT * FROM users WHERE u_status = $1`, [status]);
};

export const insertBook = async (
  category_id,
  isbn,
  title,
  author,
  total_copies,
  available_copies,
) => {
  return await query(
    `INSERT INTO books 
        (category_id, b_isbn, b_title, b_author, b_total_copies, b_available_copies)
        VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [category_id, isbn, title, author, total_copies, available_copies],
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
  status,
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
    ],
  );
};

export const hasActiveBorrows = async (book_id) => {
  return await query(
    `SELECT COUNT(*) as count FROM borrow_records WHERE book_id = $1 AND br_status = 'borrowed'`,
    [book_id],
  );
};

export const deleteBook = async (book_id) => {
  return await query(
    `UPDATE books SET b_is_deleted = true WHERE book_id = $1 RETURNING *`,
    [book_id],
  );
};

export const insertCategory = async (name, description) => {
  return await query(
    `INSERT INTO categories (c_name, c_description) VALUES ($1, $2) RETURNING *`,
    [name, description],
  );
};

export const updateCategory = async (category_id, name, description) => {
  return await query(
    `UPDATE categories SET c_name = $1, description = $2 WHERE category_id = $3 RETURNING *`,
    [name, description, category_id],
  );
};

export const memberPayFinesRepo = async (borrow_id, amount) => {
  return await query(
    `UPDATE fine_records SET fr_paid_amount = fr_paid_amount + $1 WHERE borrow_id = $2 RETURNING *`,
    [amount, borrow_id],
  );
};
