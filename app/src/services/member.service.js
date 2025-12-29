import * as memberRepo from "../repositories/member.repository.js";
import * as validator from "./validators/validator.js";

function getRowOrNull(result) {
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

export const viewBooks = async() => {
    const result = await memberRepo.getBooks;
    return getRowOrNull(result);
}

export const viewBooksByCategory = async(category_id) => {
    validator.idValidator(category_id);

    const result = await memberRepo.getBooksByCategory(category_id);
    return getRowOrNull(result);
}

export const viewBooksByTitle = async(title) => {
    validator.titleValidator(title);

    const result = await memberRepo.getBooksByTitle(title);
    return getRowOrNull(result);
}

export const viewBooksByAuthor = async(author) => {
    validator.humanNameValidator(author);

    const result = await memberRepo.getBooksByAuthor(author);
    return getRowOrNull(result);
}

export const viewMyBorrowHistory = async(user_id) => {
    validator.idValidator(user_id);

    const result = await memberRepo.viewMyBorrowHistory(user_id);
    return getRowOrNull(result);
}

export const viewMyFineStatus = async(user_id) => {
    validator.idValidator(user_id);

    const result = await memberRepo.getMyFineStatus(user_id);
    return getRowOrNull(result);
}