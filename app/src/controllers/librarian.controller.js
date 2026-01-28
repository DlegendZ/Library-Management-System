import * as librarianService from "../services/librarian.service.js";
// import * as authToken from "../authentication/token.js";
// import { query } from "../../database.js";

export const registerMemberController = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const result = await librarianService.registerMember(
      full_name,
      email,
      password
    );
    return res.status(201).json({ message: "Member account created." });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

// export const loginLibrarianController = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const { accessToken, refreshToken, refreshId, expires_at } =
//       await librarianService.loginLibrarian(email, password, req);

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

// export const logoutLibrarianController = async (req, res) => {
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

// export const borrowBookController = async (req, res) => {
//   const { user_id, book_id, due_at } = req.body;

//   try {
//     const result = await librarianService.borrowBook(user_id, book_id, new Date(due_at));
//     return res.status(200).json({ message: "Borrowed a book" });
//   } catch (err) {
//     console.error("error :", err);
//     return res
//       .status(err.status || 500)
//       .json({ message: err.status ? err.message : "Internal Server Error" });
//   }
// };

// export const returnBookController = async (req, res) => {
//   const borrow_id = Number(req.params.borrow_id);

//   try {
//     const result = await librarianService.returnBook(borrow_id);
//     return res.status(200).json({ message: "Returned a book" });
//   } catch (err) {
//     console.error("error :", err);
//     return res
//       .status(err.status || 500)
//       .json({ message: err.status ? err.message : "Internal Server Error" });
//   }
// };

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
    return res.status(200).json({ message: "Updated a fine record" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};