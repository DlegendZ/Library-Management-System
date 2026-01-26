import * as adminService from "../services/admin.service.js";
// import * as authToken from "../authentication/token.js";
// import { query } from "../../database.js";

export const registerAdminController = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const result = await adminService.registerAdmin(full_name, email, password);
    return res.status(201).json({ message: "Admin account created." });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

// export const loginAdminController = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const { accessToken, refreshToken, refreshId, expires_at } =
//       await adminService.loginAdmin(email, password, req);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       expires: expires_at,
//     });

//     return res.status(200).json({ accessToken, refreshId });
//   } catch (err) {
//     console.error("error :", err);
//     if (err.status || err.message === "User not found") {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const refATController = async (req, res) => {
//   //refresh access token
//   const refreshToken = req.cookies?.refreshToken;
//   if (!refreshToken)
//     return res.status(401).json({ error: "Refresh token not found" });
//   const row = await authToken.findRefreshToken(refreshToken);
//   if (!row) return res.status(401).json({ error: "Invalid refresh token" });

//   try {
//     const userRes = await query(`SELECT * FROM users WHERE user_id = $1`, [
//       row.user_id,
//     ]);
//     const user = userRes.rows[0];
//     const accessToken = authToken.signAccessToken(user);
//     return res.status(200).json({ accessToken });
//   } catch (err) {
//     console.log("error :", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const logoutAdminController = async (req, res) => {
//   const refreshToken = req.cookies?.refreshToken;

//   try {
//     if (refreshToken) {
//       const row = await authToken.findRefreshToken(refreshToken);
//       if (row) await authToken.revokeRefreshToken(row.id);
//       res.cookie("refreshToken", "", {
//         httpOnly: true,
//         secure: false,
//         sameSite: "lax",
//         maxAge: 0,
//       });

//       res.status(200).json({ message: "Logged out" });
//     } else {
//       res.status(200).json({ message: "Required refresh token" });
//     }
//   } catch (err) {
//     console.error("Error : ", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const registerLibrarianController = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const result = await adminService.registerLibrarian(
      full_name,
      email,
      password,
    );
    return res.status(201).json({ message: "Librarian account created." });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const assignRolesController = async (req, res) => {
  const { user_id, role_id } = req.body;
  try {
    const result = await adminService.assignRoles(user_id, role_id);
    return res.status(200).json({ message: "Updated user's role" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const assignStatusController = async (req, res) => {
  const { user_id, status } = req.body;
  try {
    const result = await adminService.assignStatus(user_id, status);
    return res.status(200).json({ message: "Updated user's status" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewAllUsersController = async (req, res) => {
  try {
    const result = await adminService.viewAllUsers();
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
  try {
    const result = await adminService.viewBorrowRecords();
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
    const result = await adminService.viewFineRecords();
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewMemberBorrowHistoryController = async (req, res) => {
  const { user_id } = req.query;

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

export const viewBooksWithBorrowersController = async (req, res) => {
  const { status } = req.query;

  try {
    const result = await adminService.viewBooksWithBorrowers(status);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewUsersWithFinesController = async (req, res) => {
  const { status } = req.query;

  try {
    const result = await adminService.viewUsersWithFines(status);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewUserByStatusController = async (req, res) => {
  const { status } = req.query;

  try {
    const result = await adminService.viewUserByStatus(status);
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
    return res.status(200).json({ message: "Added a book" });
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
    return res.status(200).json({ message: "updated book's info" });
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
    return res.status(200).json({ message: "Deleted a book" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const addCategoryController = async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await adminService.addCategory(name, description);
    return res.status(200).json({ message: "Added a category" });
  } catch (err) {
    console.error("error :", err);
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
    return res.status(200).json({ message: "Updated a category" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};
