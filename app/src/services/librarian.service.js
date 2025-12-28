import * as librarian from "../repositories/librarian.repository.js";
import * as validator from "./validators/validator.js";

function getRowOrNull(result) {
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

export const registerMember = async (full_name, email, password_hash) => {
  validator.humanNameValidator(full_name);
  validator.emailValidator(email);

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
  validator.idValidator(category_id);
  validator.isbnValidator(isbn);
  validator.titleValidator(title);
  validator.humanNameValidator(author);
  validator.totalCopiesValidator(total_copies);
  validator.availableCopiesValidator(available_copies);

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
  validator.idValidator(book_id);
  validator.idValidator(category_id);
  validator.isbnValidator(isbn);
  validator.titleValidator(title);
  validator.humanNameValidator(author);
  validator.totalCopiesValidator(total_copies);
  validator.availableCopiesValidator(available_copies);
  validator.statusValidator(status);

  const result = await admin.updateBook(book_id, book_info);
  return getRowOrNull(result);
};

export const borrowBook = async (user_id, book_id, due_at) => {
  validator.idValidator(user_id);
  validator.idValidator(book_id);
  validator.deadlineTimeStampValidator(due_at);

  const result = await librarian.borrowBook(user_id, book_id, due_at);
  return getRowOrNull(result);
};

export const returnBook = async (borrow_id) => {
  validator.idValidator(borrow_id);

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
