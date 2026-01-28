import * as memberService from "../services/member.service.js";

export const borrowBookController = async (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.user_id;

  try {
    const result = await memberService.borrowBook(user_id, book_id);
    return res.status(200).json({ message: "Borrowed a book" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};

export const returnBookController = async (req, res) => {
  const { user_id, borrow_id } = req.params;

  if (req.user.user_id !== user_id) return res.status(401).json({message: "unauthorized"});

  try {
    const result = await memberService.returnBook(borrow_id);
    return res.status(200).json({ message: "Returned a book" });
  } catch (err) {
    console.error("error :", err);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Internal Server Error" });
  }
};


export const viewBooksController = async (req, res) => {
  const {category_id, title, author} = req.query;
  try {
    const result = await memberService.viewBooks(category_id, title, author);
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

  if (req.user.user_id !== user_id) return res.status(401).json({message: "unauthorized"});

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

  if (req.user.user_id !== user_id) return res.status(401).json({message: "unauthorized"});

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
