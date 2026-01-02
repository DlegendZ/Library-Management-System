import * as adminRepo from "../repositories/admin.repository.js";
import * as validator from "./validators/validator.js";
import argon2 from "argon2";
import * as authToken from "../authentication/token.js";

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

export const loginAdmin = async (email, password, req) => {
  validator.emailValidator(email);
  validator.passwordValidator(password);

  const userRes = await adminRepo.getUserByEmail(email);
  const user = userRes.rows[0];

  if (!user) throw new Error("User not found");
  const password_verified = await argon2.verify(user.password_hash, password);
  if (!password_verified) throw new Error("Password not found");

  const accessToken = authToken.signAccessToken(user);
  const refreshToken = authToken.generateRefreshToken();

  const { id: refreshId, expires_at } = authToken.saveRefreshToken({
    user,
    refreshToken,
    req,
  });

  return { accessToken, refreshToken, refreshId, expires_at };
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
    password_hash
  );
  return getRowOrNull(result);
};

export const assignRoles = async (user_id, role_id) => {
  validator.idValidator(role_id);
  const result = await adminRepo.updateRoles(user_id, role_id);
  return getRowOrNull(result);
};

export const assignStatus = async (user_id, status) => {
  validator.statusValidator(status);
  const result = await adminRepo.updateStatus(user_id, status);
  return getRowOrNull(result);
};

export const viewAllUsers = async () => {
  const result = await adminRepo.getAllUsers();
  return getRowOrNull(result);
};

export const viewRollAssignments = async () => {
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

export const viewBorrowRecords = async () => {
  const result = await adminRepo.getBorrowRecords();
  return getRowOrNull(result);
};

export const viewFineRecords = async () => {
  const result = await adminRepo.viewFineRecords();
  return getRowOrNull(result);
};

export const viewMemberBorrowHistory = async (user_id) => {
  const result = await adminRepo.viewMemberBorrowHistory(user_id);
  return getRowOrNull(result);
};

export const viewBooksWithBorrowers = async (status) => {
  validator.statusValidator(status);
  const result = await adminRepo.getBooksWithBorrowers(status);
  return getRowOrNull(result);
};

export const viewUsersWithFines = async (status) => {
  validator.statusValidator(status);
  const result = await adminRepo.getUsersWithFines(status);
  return getRowOrNull(result);
};

export const viewUserByStatus = async (status) => {
  validator.statusValidator(status);
  const result = await adminRepo.getBooksWithBorrowers(status);
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

  const result = await adminRepo.insertBook(book_info);
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

  const result = await adminRepo.updateBook(book_id, book_info);
  return getRowOrNull(result);
};

export const deleteBook = async (book_id) => {
  validator.idValidator(book_id);

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
