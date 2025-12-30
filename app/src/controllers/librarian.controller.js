import * as librarianService from "../services/librarian.service.js";
import * as validator from "../services/validators/validator.js";
import argon2 from "argon2";

export const registerMemberController = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    validator.passwordValidator(password);

    const password_hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 32768,
      timeCost: 2,
      parallelism: 1,
    });

    const result = await adminService.registerLibrarian(
      full_name,
      email,
      password_hash
    );
    return res.status(201).json({ message: "Librarian account created." });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewAllMemberController = async (req, res) => {
  try {
    const result = await librarianService.viewAllMembers();
    return res.status(200).json({ message: "Displayed all members" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const addBookController = async (req, res) => {
  const { category_id, isbn, title, author, total_copies, available_copies } =
    req.body;

  try {
    const result = await librarianService.addBook(
      category_id,
      isbn,
      title,
      author,
      total_copies,
      available_copies
    );
    return res.status(200).json({ message: "Displayed all books" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const updateBookController = async (req, res) => {
  const {
    book_id,
    status,
    category_id,
    isbn,
    title,
    author,
    total_copies,
    available_copies,
  } = req.body;

  try {
    const result = await librarianService.updateBook(
      book_id,
      category_id,
      isbn,
      title,
      author,
      total_copies,
      available_copies,
      status
    );
    return res.status(200).json({ message: "Updated a book" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const borrowBookController = async (req, res) => {
  const { user_id, book_id, due_at } = req.body;

  try {
    const result = await librarianService.borrowBook(user_id, book_id, due_at);
    return res.status(200).json({ message: "Borrowed a book" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const returnBookController = async (req, res) => {
  const { borrow_id } = req.body;

  try {
    const result = await librarianService.returnBook(borrow_id);
    return res.status(200).json({ message: "Returned a book" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBorrowRecordsController = async (req, res) => {
  try {
    const result = await librarianService.viewBorrowRecords();
    return res.status(200).json({ message: "Displayed all borrow records" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewFineRecordsController = async (req, res) => {
  try {
    const result = await librarianService.viewFineRecords();
    return res.status(200).json({ message: "Displayed all fine records" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};