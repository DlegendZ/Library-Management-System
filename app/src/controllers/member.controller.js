import * as memberService from "../services/member.service.js";
// import * as authToken from "../authentication/token.js";
// import { query } from "../../database.js";

// export const loginMemberController = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const { accessToken, refreshToken, refreshId, expires_at } =
//       await memberService.loginMember(email, password, req);

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

// export const logoutMemberController = async (req, res) => {
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

export const viewBooksController = async (req, res) => {
  try {
    const result = await memberService.viewBooks();
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBooksByCategoryController = async (req, res) => {
  const { category_id } = req.query;

  try {
    const result = await memberService.viewBooksByCategory(category_id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBooksByTitleController = async (req, res) => {
  const { title } = req.query;

  try {
    const result = await memberService.viewBooksByTitle(title);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBooksByAuthorController = async (req, res) => {
  const { author } = req.query;

  try {
    const result = await memberService.viewBooksByAuthor(author);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewMyBorrowHistoryController = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await memberService.viewMyBorrowHistory(user_id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewMyFineStatusController = async (req, res) => {
  const { user_id } = req.params;
  const { status } = req.query;

  try {
    const result = await memberService.viewMyFineStatus(user_id, status);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};
