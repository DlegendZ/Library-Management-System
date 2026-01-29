import * as memberService from "../services/member.service.js";

export const borrowBookController = async (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.user_id;

  try {
    const result = await memberService.borrowBook(user_id, book_id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const returnBookController = async (req, res) => {
  const { user_id } = req.user;
  const { borrow_id } = req.params;

  try {
    const result = await memberService.returnBook(user_id, borrow_id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};


export const viewBooksController = async (req, res) => {
  const {category_name, title, author} = req.query;
  try {
    const result = await memberService.viewBooks(category_name, title, author);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const viewMyBorrowHistoryController = async (req, res) => {
  const { user_id } = req.user;

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
  const { user_id } = req.user;
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
