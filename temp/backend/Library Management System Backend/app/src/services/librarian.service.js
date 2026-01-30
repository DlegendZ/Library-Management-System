import * as librarianRepo from "../repositories/librarian.repository.js";
import * as validator from "./validators/validator.js";
import argon2 from "argon2";

function getRowOrNull(result) {
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

export const registerMember = async (full_name, email, password) => {
  validator.humanNameValidator(full_name);
  validator.emailValidator(email);
  validator.passwordValidator(password);

  const password_hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 32768,
    timeCost: 2,
    parallelism: 1,
  });

  const result = await librarianRepo.insertMember(
    full_name,
    email,
    password_hash,
  );
  return getRowOrNull(result);
};

export const viewAllMembers = async () => {
  const result = await librarianRepo.getAllMembers();
  return getRowOrNull(result);
};

export const viewCategories = async () => {
  const result = await librarianRepo.getCategories();
  return getRowOrNull(result);
};

export const addBook = async (
  category_id,
  isbn,
  title,
  author,
  total_copies,
  available_copies,
) => {
  validator.idValidator(category_id);
  validator.isbnValidator(isbn);
  validator.titleValidator(title);
  validator.humanNameValidator(author);
  validator.totalCopiesValidator(total_copies);
  validator.availableCopiesValidator(total_copies, available_copies);

  const result = await librarianRepo.insertBook(
    category_id,
    isbn,
    title,
    author,
    total_copies,
    available_copies,
  );
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
  status,
) => {
  validator.idValidator(book_id);
  validator.idValidator(category_id);
  validator.isbnValidator(isbn);
  validator.titleValidator(title);
  validator.humanNameValidator(author);
  validator.totalCopiesValidator(total_copies);
  validator.availableCopiesValidator(total_copies, available_copies);
  validator.statusValidator(status);

  const result = await librarianRepo.updateBook(
    book_id,
    category_id,
    isbn,
    title,
    author,
    total_copies,
    available_copies,
    status,
  );
  return getRowOrNull(result);
};

export const viewBorrowRecords = async () => {
  const result = await librarianRepo.getBorrowRecords();
  return getRowOrNull(result);
};

export const viewFineRecords = async () => {
  const result = await librarianRepo.getFineRecords();
  return getRowOrNull(result);
};

export const memberPayFinesService = async (borrow_id, amount) => {
  validator.idValidator(borrow_id);
  validator.finePaidAmountValidator(amount);

  const result = await librarianRepo.memberPayFinesRepo(borrow_id, amount);
  return getRowOrNull(result);
};
