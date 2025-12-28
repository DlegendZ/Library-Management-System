import * as admin from "../repositories/admin.repository.js";
import * as validator from "./validators/validator.js";

function getRowOrNull(result) {
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

export const registerLibrarian = async (full_name, email, password_hash) => {
  validator.humanNameValidator(full_name);
  validator.emailValidator(email);

  const result = await admin.insertLibrarian(full_name, email, password_hash);
  return getRowOrNull(result);
};

export const assignRoles = async (user_id, role_id) => {
  if (!(role_id === 1 || role_id === 2 || role_id === 3)) {
    throw new Error("Invalid role id");
  }

  const result = await admin.updateRoles(user_id, role_id);
  return getRowOrNull(result);
};

export const assignStatus = async (user_id, status) => {
  if (!(status === "active" || status === "suspended")) {
    throw new Error("Invalid Status");
  }

  const result = await admin.updateStatus(user_id, status);
  return getRowOrNull(result);
};

export const viewAllUsers = async () => {
  const result = await admin.getAllUsers();
  return getRowOrNull(result);
};

export const viewRollAssignments = async () => {
  const result = await admin.getRolesAssignments();
  return getRowOrNull(result);
};

export const viewAllBooks = async () => {
  const result = await admin.getBooks();
  return getRowOrNull(result);
};

export const viewAllCategories = async () => {
  const result = await admin.getCategories();
  return getRowOrNull(result);
};

export const viewBorrowRecords = async () => {
  const result = await admin.getBorrowRecords();
  return getRowOrNull(result);
};

export const viewFineRecords = async () => {
  const result = await admin.viewFineRecords();
  return getRowOrNull(result);
};

export const viewMemberBorrowHistory = async (user_id) => {
  const result = await admin.viewMemberBorrowHistory(user_id);
  return getRowOrNull(result);
};

export const viewBooksWithBorrowers = async (status) => {
  if (
    !(status === "borrowed" || status === "returned" || status === "overdue")
  ) {
    throw new Error("Invalid Status");
  }

  const result = await admin.getBooksWithBorrowers(status);
  return getRowOrNull(result);
};

export const viewUsersWithFines = async (status) => {
  if (
    !(
      status === "unpaid" ||
      status === "partial" ||
      status === "paid" ||
      status === "waived"
    )
  ) {
    throw new Error("Invalid Status");
  }

  const result = await admin.getUsersWithFines(status);
  return getRowOrNull(result);
};

export const viewUserByStatus = async (status) => {
  if (!(status === "active" || status === "suspended")) {
    throw new Error("Invalid Status");
  }

  const result = await admin.getBooksWithBorrowers(status);
  return getRowOrNull(result);
};

export const addBook = async (
  category_id,
  isbn,
  title,
  author,
  total_copies,
  available_copies
) => {
  const book_info = {
    category_id,
    isbn,
    title,
    author,
    total_copies,
    available_copies,
  };

  bookValidatorSimple(book_info);

  const result = await admin.insertBook(book_info);
  return getRowOrNull(result);
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
  const book_info = {
    book_id,
    category_id,
    isbn,
    title,
    author,
    total_copies,
    available_copies,
    status,
  };

  bookValidatorAll(book_info);

  const result = await admin.updateBook(book_id, book_info);
  return getRowOrNull(result);
};

export const deleteBook = async (book_id) => {
  if (!(book_id && Number.isInteger(book_id) && book_id > 0)) {
    throw new Error("Book ID is invalid");
  }

  const result = await admin.deleteBook(book_id);
  return getRowOrNull(result);
};

export const addCategory = async (name, description) => {
  categoryValidatorSimple(name, description);

  const result = await admin.insertCategory(name, description);
  return getRowOrNull(result);
};

export const updateCategory = async (category_id, name, description) => {
  categoryValidatorAll(category_id, name, description);

  const result = await admin.updateCategory(category_id, name, description);
  return getRowOrNull(result);
};
