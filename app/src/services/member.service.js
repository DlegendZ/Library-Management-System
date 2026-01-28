import { use, useReducer } from "react";
import * as memberRepo from "../repositories/member.repository.js";
import * as validator from "./validators/validator.js";
// import argon2 from "argon2";
// import * as authToken from "../authentication/token.js";

class forbiddenRequest extends Error {
  constructor(message) {
    super.message;
    this.status = 403;
  }
}

function getRowOrNull(result) {
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

// export const loginMember = async (email, password, req) => {
//   validator.emailValidator(email);
//   validator.passwordValidator(password);

//   const userRes = await memberRepo.getUserByEmail(email);
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

export const borrowBook = async (user_id, book_id, due_at) => {
  validator.idValidator(user_id);
  validator.idValidator(book_id);
  validator.deadlineTimeStampValidator(due_at);

  const status_result = await memberRepo.getMyStatus(user_id);
  const status = status_result.rows[0];

  if (status === "suspended") throw new forbiddenRequest("User is suspended and cannot borrow books");
  
  const books_borrowed_count_result = await memberRepo.getMyBorrowBooksCount(user_id);
  const books_borrowed_count = books_borrowed_count_result.rows[0];

  if (books_borrowed_count >= 3) throw new forbiddenRequest("Borrow limit exceeded. Maximum allowed is 3 books.");

  const book_status_result = await memberRepo.getMyBookStatus(book_id);
  const book_status = book_status_result.rows[0];

  if (book_status === "unavailable") throw new forbiddenRequest("Book is unavailable and cannot be borrowed.");

  const result = await memberRepo.borrowBook(user_id, book_id, due_at);
  return getRowOrNull(result);
};

export const viewBooks = async () => {
  const result = await memberRepo.getBooks();
  return getRowOrNull(result);
};

export const viewBooksByCategory = async (category_id) => {
  validator.idValidator(category_id);

  const result = await memberRepo.getBooksByCategory(category_id);
  return getRowOrNull(result);
};

export const viewBooksByTitle = async (title) => {
  validator.titleValidator(title);

  const result = await memberRepo.getBooksByTitle(title);
  return getRowOrNull(result);
};

export const viewBooksByAuthor = async (author) => {
  validator.humanNameValidator(author);

  const result = await memberRepo.getBooksByAuthor(author);
  return getRowOrNull(result);
};

export const viewMyBorrowHistory = async (user_id) => {
  validator.idValidator(user_id);

  const result = await memberRepo.getMyBorrowHistory(user_id);
  return getRowOrNull(result);
};

export const viewMyFineStatus = async (user_id, status) => {
  validator.idValidator(user_id);
  validator.statusValidator(status);

  const result = await memberRepo.getMyFineStatus(user_id, status);
  return getRowOrNull(result);
};
