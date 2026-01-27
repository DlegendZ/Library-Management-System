import { Router } from "express";
import * as memberController from "../controllers/member.controller.js";

const router = Router();

// router.post("/login", memberController.loginMemberController);
// router.post("/refresh", memberController.refATController);
// router.post("/logout", memberController.logoutMemberController);

router.get("/books", memberController.viewBooksController);
router.get("/books/categories", memberController.viewBooksByCategoryController);
router.get("/books/titles", memberController.viewBooksByTitleController);
router.get("/books/authors", memberController.viewBooksByAuthorController);
router.get("/members/:user_id/borrow-records", memberController.viewMyBorrowHistoryController);
router.get("/members/:user_id/fine-records/status", memberController.viewMyFineStatusController);

export default router;
