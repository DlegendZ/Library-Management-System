import { Router } from "express";
import * as memberController from "../controllers/member.controller.js";

const router = Router();

router.get("/books", memberController.viewBooksController);
router.get("/books-category", memberController.viewBooksByCategoryController);
router.get("/books-title", memberController.viewBooksByTitleController);
router.get("/books-author", memberController.viewBooksByAuthorController);
router.get("/borrow-history", memberController.viewMyBorrowHistoryController);
router.get("/fine-status", memberController.viewMyFineStatusController);

export default router;