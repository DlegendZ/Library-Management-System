import * as memberRepo from "../repositories/member.repository.js";
import * as validator from "./validators/validator.js";

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

export const borrowBook = async (user_id, book_id) => {
  validator.idValidator(user_id);
  validator.idValidator(book_id);

  const status_result = await memberRepo.getMyStatus(user_id);
  const status = status_result.rows[0].u_status;

  if (status === "suspended")
    throw new forbiddenRequest("User is suspended and cannot borrow books");

  const books_borrowed_count_result =
    await memberRepo.getMyBorrowBooksCount(user_id);
  const books_borrowed_count = Number(
    books_borrowed_count_result.rows[0].count,
  );

  if (books_borrowed_count >= 3)
    throw new forbiddenRequest(
      "Borrow limit exceeded. Maximum allowed is 3 books.",
    );

  const find_book_result = await memberRepo.findMyBook(book_id);
  if (find_book_result.rows.length === 0)
    throw new forbiddenRequest("Book not found");

  const book_status_result = await memberRepo.getMyBookStatus(book_id);
  const book_status = book_status_result.rows[0].b_status;

  if (book_status === "unavailable")
    throw new forbiddenRequest("Book is unavailable and cannot be borrowed.");

  const same_book_borrowed_result = await memberRepo.getMyBorrowedBooks(
    user_id,
    book_id,
  );
  const same_book_borrowed = Number(same_book_borrowed_result.rows[0].count);

  if (same_book_borrowed > 0)
    throw new forbiddenRequest(
      "The same book cannot be borrowed more than once at the same time.",
    );

  const total_unpaid_fines_result = await memberRepo.getMyUnpaidFines(user_id);
  const total_unpaid_fines = Number(total_unpaid_fines_result.rows[0].sum) || 0;

  if (total_unpaid_fines > 100000)
    throw new forbiddenRequest(
      "Borrowing is not allowed because outstanding fines exceed the permitted limit.",
    );

  const result = await memberRepo.borrowBook(user_id, book_id);
  return getRowOrNull(result);
};

export const returnBook = async (user_id, borrow_id) => {
  validator.idValidator(user_id);
  validator.idValidator(borrow_id);

  const result = await memberRepo.returnBook(user_id, borrow_id);
  return getRowOrNull(result);
};

export const viewBooks = async (category_name, title, author) => {
  let result;

  if (category_name) {
    validator.roleCatNameValidator(category_name);
    result = await memberRepo.getBooksByCategory(category_name);
  } else if (title) {
    validator.titleValidator(title);
    result = await memberRepo.getBooksByTitle(title);
  } else if (author) {
    validator.humanNameValidator(author);
    result = await memberRepo.getBooksByAuthor(author);
  } else {
    result = await memberRepo.getBooks();
  }

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
