import * as adminService from "../services/admin.service.js";

export const registerAdminController = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const result = await adminService.registerAdmin(full_name, email, password);
    return res.status(201).json(result);
  } catch (err) {
    console.error("error :", err);
    if (err.code === "23505")
      return res.status(409).json({ message: "Email already exists" });
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const registerLibrarianController = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const result = await adminService.registerLibrarian(
      full_name,
      email,
      password,
    );
    return res.status(201).json(result);
  } catch (err) {
    console.error("error :", err);
    if (err.code === "23505")
      return res.status(409).json({ message: "Email already exists" });
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const assignUserRoleOrStatusController = async (req, res) => {
  const { user_id } = req.params;
  const { role_id, status } = req.body;

  try {
    const result = await adminService.assignUserRoleOrStatusService(
      user_id,
      role_id,
      status,
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewAllUsersController = async (req, res) => {
  const { status } = req.query;

  try {
    const result = await adminService.viewAllUsers(status);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewRolesAssignmentsController = async (req, res) => {
  try {
    const result = await adminService.viewRolesAssignments();
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewAllBooksController = async (req, res) => {
  try {
    const result = await adminService.viewAllBooks();
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewAllCategoriesController = async (req, res) => {
  try {
    const result = await adminService.viewAllCategories();
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBorrowRecordsController = async (req, res) => {
  const { status } = req.query;

  try {
    const result = await adminService.viewBorrowRecords(status);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewFineRecordsController = async (req, res) => {
  const { status } = req.query;

  try {
    const result = await adminService.viewFineRecords(status);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewMemberBorrowHistoryController = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await adminService.viewMemberBorrowHistory(user_id);
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
    const result = await adminService.addBook(
      category_id,
      isbn,
      title,
      author,
      total_copies,
      available_copies,
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    if (err.code === "23505")
      return res.status(409).json({ message: "ISBN already exists" });
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const updateBookController = async (req, res) => {
  const { book_id } = req.params;

  const {
    category_id,
    isbn,
    title,
    author,
    total_copies,
    available_copies,
    status,
  } = req.body;

  try {
    const result = await adminService.updateBook(
      book_id,
      category_id,
      isbn,
      title,
      author,
      total_copies,
      available_copies,
      status,
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const deleteBookController = async (req, res) => {
  const { book_id } = req.params;

  try {
    const result = await adminService.deleteBook(book_id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

export const addCategoryController = async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await adminService.addCategory(name, description);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    if (err.code === "23505")
      return res.status(409).json({ message: "Category already exists" });
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const updateCategoryController = async (req, res) => {
  const { category_id } = req.params;

  const { name, description } = req.body;

  try {
    const result = await adminService.updateCategory(
      category_id,
      name,
      description,
    );
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
    const result = await adminService.memberPayFinesService(borrow_id, amount);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};
