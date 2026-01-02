import { Router } from "express";
import * as librarianController from "../controllers/librarian.controller.js";

const router = Router();

router.post("/login", librarianController.loginLibrarianController);
router.post("/refresh", librarianController.refATController);
router.post("/logout", librarianController.logoutLibrarianController);
router.post("/members", librarianController.registerMemberController);
router.get("/members", librarianController.viewAllMemberController);
router.post("/books", librarianController.addBookController);
router.put("/books", librarianController.updateBookController);
router.post("/borrow-records", librarianController.borrowBookController);
router.put("/borrow-records", librarianController.returnBookController);
router.get("/borrow-records", librarianController.viewBorrowRecordsController);
router.get("/fine-records", librarianController.viewFineRecordsController);

export default router;
