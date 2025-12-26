import * as admin from "../repositories/admin.repository.js";
import nameValidator from "./validators/name.validator.js";
import emailValidator from "./validators/email.validator.js";
import { Result } from "pg";

export const registerLibrarian = async (full_name, email, password_hash) => {
  nameValidator(full_name);
  emailValidator(email);

  const result = await admin.insertLibrarian(full_name, email, password_hash);
  return result.rows[0];
};

export const assignRoles = async (user_id, role_id) => {
  const result = await admin.updateRoles(user_id, role_id);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

export const assignStatus = async(user_id, status) => {
  const result = await admin.updateStatus(user_id, status);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

export const viewAllUsers = async() => {
  const result = await admin.getAllUsers();

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
};

export const viewRollAssignments = async() => {
  const result = await admin.getRolesAssignments();

  if (result.rows.length === 0) {
    return null;
  }

  return Result.rows;
}

export const viewAllBooks = async() => {
  const result = await admin.getBooks();

  if (result.rows.length === 0) {
    return null;
  }

  return Result.rows;
}

export const viewAllCategories = async() => {
  const result = await admin.getCategories();

  if (result.rows.length === 0) {
    return null;
  }

  return Result.rows;
}

export const viewBorrowRecords = async() => {
  const result = await admin.getBorrowRecords();

  if (result.rows.length === 0) {
    return null;
  }

  return Result.rows;
}

export const viewFineRecords = async() => {
  const result = await admin.viewFineRecords();

  if (result.rows.length === 0) {
    return null;
  }

  return Result.rows;
}

export const viewMemberBorrowHistory = async(user_id) => {
  const result = await admin.viewMemberBorrowHistory(user_id);

  if (result.rows.length === 0) {
    return null;
  }

  return Result.rows;
}

// export const viewBooksWithBorrowers = async 