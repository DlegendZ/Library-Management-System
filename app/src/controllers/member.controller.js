import * as memberService from "../services/member.service.js";
import * as validator from "../services/validators/validator.js";
import argon2 from "argon2";

export const viewBooksController = async (req, res) => {
  try {
    const result = await memberService.viewBooks();
    return res.status(200).json({ message: "Displayed all books" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBooksByCategoryController = async (req, res) => {
  const { category_id } = req.body;

  try {
    const result = await memberService.viewBooksByCategory(category_id);
    return res.status(200).json({ message: "Displayed all books by category" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBooksByTitleController = async (req, res) => {
  const { title } = req.body;

  try {
    const result = await memberService.viewBooksByTitle(title);
    return res.status(200).json({ message: "Displayed all books by title" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewBooksByAuthorController = async (req, res) => {
  const { author } = req.body;

  try {
    const result = await memberService.viewBooksByAuthor(author);
    return res.status(200).json({ message: "Displayed all books by author" });
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
    return res.status(200).json({ message: "Displayed borrow history" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewMyFineStatusController = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await memberService.viewMyFineStatus(user_id);
    return res.status(200).json({ message: "Displayed fine status" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};
