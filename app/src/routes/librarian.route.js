import { Router } from "express";
import * as librarianController from "../controllers/librarian.controller.js";

const router = Router();

// router.post("/login", librarianController.loginLibrarianController);
// router.post("/refresh", librarianController.refATController);
// router.post("/logout", librarianController.logoutLibrarianController);

router.post("/members", librarianController.registerMemberController);
router.post("/books", librarianController.addBookController);
router.post("/borrow-records", librarianController.borrowBookController);

router.get("/members", librarianController.viewAllMemberController);
router.get("/borrow-records", librarianController.viewBorrowRecordsController);
router.get("/fine-records", librarianController.viewFineRecordsController);

router.put("/books/:book_id", librarianController.updateBookController);
router.put("/borrow-records/:borrow_id", librarianController.returnBookController);

export default router;
