import * as adminRepo from "../repositories/admin.repository.js";
import * as validator from "./validators/validator.js";
import argon2 from "argon2";
// import * as authToken from "../authentication/token.js";

// function getRowOrNull(result) {
//   if (result.rows.length === 0) {
//     return null;
//   }

//   return result.rows;
// }

class forbiddenRequest extends Error {
  constructor(message) {
    super.message;
    this.status = 403;
  }
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
  return result.rows;
};

// export const loginAdmin = async (email, password, req) => {
//   validator.emailValidator(email);
//   validator.passwordValidator(password);

//   const userRes = await adminRepo.getUserByEmail(email);
//   const user = userRes.rows[0];

//   if (!user) throw new Error("User not found");
//   const password_verified = await argon2.verify(user.password_hash, password);
//   if (!password_verified) throw new Error("Password not found");

//   const accessToken = authToken.signAccessToken(user);
//   const refreshToken = authToken.generateRefreshToken();

//   const { id: refreshId, expires_at } = await authToken.saveRefreshToken({
//     user,
//     refreshToken,
//     req,
//   });

//   return { accessToken, refreshToken, refreshId, expires_at };
// };

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
  return result.rows;
};

export const assignRoles = async (user_id, role_id) => {
  validator.idValidator(role_id);
  const result = await adminRepo.updateRoles(user_id, role_id);
  return result.rows;
};

export const assignStatus = async (user_id, status) => {
  validator.statusValidator(status);
  const result = await adminRepo.updateStatus(user_id, status);
  return result.rows;
};

export const viewAllUsers = async () => {
  const result = await adminRepo.getAllUsers();
  return result.rows;
};

export const viewRolesAssignments = async () => {
  const result = await adminRepo.getRolesAssignments();
  return result.rows;
};

export const viewAllBooks = async () => {
  const result = await adminRepo.getBooks();
  return result.rows;
};

export const viewAllCategories = async () => {
  const result = await adminRepo.getCategories();
  return result.rows;
};

export const viewBorrowRecords = async () => {
  const result = await adminRepo.getBorrowRecords();
  return result.rows;
};

export const viewFineRecords = async () => {
  const result = await adminRepo.getFineRecords();
  return result.rows;
};

export const viewMemberBorrowHistory = async (user_id) => {
  const result = await adminRepo.getMemberBorrowHistory(user_id);
  return result.rows;
};

export const viewBooksWithBorrowers = async (status) => {
  validator.statusValidator(status);
  const result = await adminRepo.getBooksWithBorrowers(status);
  return result.rows;
};

export const viewUsersWithFines = async (status) => {
  validator.statusValidator(status);
  const result = await adminRepo.getUsersWithFines(status);
  return result.rows;
};

export const viewUserByStatus = async (status) => {
  validator.statusValidator(status);
  const result = await adminRepo.getUserByStatus(status);
  return result.rows;
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
  return result.rows;
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
  return result.rows;
};

export const deleteBook = async (book_id) => {
  validator.idValidator(book_id);

  const copies_result = await adminRepo.getBookInfo(book_id);
  const { available_copies, total_copies } = copies_result.rows[0];

  if (available_copies < total_copies)
    throw new forbiddenRequest(
      "Book cannot be deleted because it is currently borrowed.",
    );

  const result = await adminRepo.deleteBook(book_id);
  return result.rows;
};

export const addCategory = async (name, description) => {
  validator.roleCatNameValidator(name);
  validator.roleCatDescValidator(description);

  const result = await adminRepo.insertCategory(name, description);
  return result.rows;
};

export const updateCategory = async (category_id, name, description) => {
  validator.idValidator(category_id);
  validator.roleCatNameValidator(name);
  validator.roleCatDescValidator(description);

  const result = await adminRepo.updateCategory(category_id, name, description);
  return result.rows;
};

export const memberPayFinesService = async (borrow_id, amount) => {
  validator.idValidator(borrow_id);
  validator.finePaidAmountValidator(amount);

  const result = await adminRepo.memberPayFinesRepo(borrow_id, amount);
  return result.rows[0];
}
