import * as librarianService from "../services/librarian.service.js";

export const registerMemberController = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const result = await librarianService.registerMember(
      full_name,
      email,
      password
    );
    return res.status(201).json(result);
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
    return res.status(200).json(result);
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
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const updateBookController = async (req, res) => {
  const { book_id } = req.params;

  const {
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
    return res.status(200).json(result);
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
    return res.status(200).json(result);
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
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const memberPayFinesController = async (req, res) => {
  const { borrow_id } = req.params;

  const { amount } = req.body;

  try {
    const result = await librarianService.memberPayFinesService(
      borrow_id,
      amount,
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};