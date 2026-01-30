import * as adminRepo from "../repositories/admin.repository.js";
import * as validator from "./validators/validator.js";
import argon2 from "argon2";

class forbiddenRequest extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}

function getRowOrNull(result) {
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

export const registerAdmin = async (full_name, email, password) => {
  validator.humanNameValidator(full_name);
  validator.emailValidator(email);
  validator.passwordValidator(password);

  const password_hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 32768,
    timeCost: 2,
    parallelism: 1,
  });

  const result = await adminRepo.registerAdmin(full_name, email, password_hash);
  return getRowOrNull(result);
};

export const registerLibrarian = async (full_name, email, password) => {
  validator.humanNameValidator(full_name);
  validator.emailValidator(email);
  validator.passwordValidator(password);

  const password_hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 32768,
    timeCost: 2,
    parallelism: 1,
  });

  const result = await adminRepo.insertLibrarian(
    full_name,
    email,
    password_hash,
  );
  return getRowOrNull(result);
};

export const assignUserRoleOrStatusService = async (
  user_id,
  role_id,
  status,
) => {
  validator.idValidator(user_id);
  let result;

  if (role_id) {
    validator.idValidator(role_id);
    result = await adminRepo.updateRoles(user_id, role_id);
  } else if (status) {
    validator.statusValidator(status);
    result = await adminRepo.updateStatus(user_id, status);
  }

  return getRowOrNull(result);
};

export const viewAllUsers = async (status) => {
  let result;

  if (status) {
    validator.statusValidator(status);
    result = await adminRepo.getUserByStatus(status);
  } else {
    result = await adminRepo.getAllUsers();
  }

  return getRowOrNull(result);
};

export const viewRolesAssignments = async () => {
  const result = await adminRepo.getRolesAssignments();
  return getRowOrNull(result);
};

export const viewAllBooks = async () => {
  const result = await adminRepo.getBooks();
  return getRowOrNull(result);
};

export const viewAllCategories = async () => {
  const result = await adminRepo.getCategories();
  return getRowOrNull(result);
};

export const viewBorrowRecords = async (status) => {
  let result;
  if (status) {
    validator.statusValidator(status);
    result = await adminRepo.getBooksWithBorrowers(status);
  } else {
    result = await adminRepo.getBorrowRecords();
  }

  return getRowOrNull(result);
};

export const viewFineRecords = async (status) => {
  let result;
  if (status) {
    validator.statusValidator(status);
    result = await adminRepo.getUsersWithFines(status);
  } else {
    result = await adminRepo.getFineRecords();
  }

  return getRowOrNull(result);
};

export const viewMemberBorrowHistory = async (user_id) => {
  const result = await adminRepo.getMemberBorrowHistory(user_id);
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

  const result = await adminRepo.insertBook(
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

  const result = await adminRepo.updateBook(
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

export const deleteBook = async (book_id) => {
  validator.idValidator(book_id);

  const borrows_result = await adminRepo.hasActiveBorrows(book_id);
  const activeCount = Number(borrows_result.rows[0].count);

  if (activeCount > 0)
    throw new forbiddenRequest(
      "Book cannot be deleted because it is currently borrowed.",
    );

  const result = await adminRepo.deleteBook(book_id);
  return getRowOrNull(result);
};

export const addCategory = async (name, description) => {
  validator.roleCatNameValidator(name);
  validator.roleCatDescValidator(description);

  const result = await adminRepo.insertCategory(name, description);
  return getRowOrNull(result);
};

export const updateCategory = async (category_id, name, description) => {
  validator.idValidator(category_id);
  validator.roleCatNameValidator(name);
  validator.roleCatDescValidator(description);

  const result = await adminRepo.updateCategory(category_id, name, description);
  return getRowOrNull(result);
};

export const memberPayFinesService = async (borrow_id, amount) => {
  validator.idValidator(borrow_id);
  validator.finePaidAmountValidator(amount);

  const result = await adminRepo.memberPayFinesRepo(borrow_id, amount);
  return getRowOrNull(result);
};
