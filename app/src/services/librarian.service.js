import * as librarian from "../repositories/librarian.repository.js";
import * as validator from "./validators/validator.js";

function getRowOrNull(result) {
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

export const registerMember = async (full_name, email, password_hash) => {
  nameValidator(full_name);
  emailValidator(email);

  

  const result = await librarian.insertMember(full_name, email, password_hash);
  return getRowOrNull(result);
};

export const viewAllMembers = async () => {
  const result = await librarian.getAllMembers();
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

export const borrowBook = async (user_id, book_id, due_at) => {
  if (!(book_id && Number.isInteger(book_id) && book_id > 0)) {
    throw new Error("Book ID is invalid");
  }

  if (!due_at) {
    throw new Error("Due date is required.");
  }

  if (
    !(
      due_at instanceof Date &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(due_at)
    )
  ) {
    throw new Error("Due date format is invalid.");
  }

  if (!(due_at > new Date().toISOString())) {
    throw new Error("Due date must be in the future.");
  }

  const result = await librarian.borrowBook(user_id, book_id, due_at);
  return getRowOrNull(result);
};

export const returnBook = async (borrow_id) => {
  if (!borrow_id) {
    throw new Error("Borrow ID is required.");
  }

  if (!(Number.isInteger(borrow_id) && borrow_id > 0)) {
    throw new Error("Borrow ID must be a positive integer.");
  }

  const result = await librarian.returnBook(borrow_id);
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
