import { Router } from "express";
import * as librarianController from "../controllers/librarian.controller.js";

const router = Router();

router.get("/members", librarianController.viewAllMemberController);
router.get("/borrow-records", librarianController.viewBorrowRecordsController);
router.get("/fine-records", librarianController.viewFineRecordsController); 

router.post("/members", librarianController.registerMemberController);
router.post("/books", librarianController.addBookController);

router.put("/books/:book_id", librarianController.updateBookController);
router.put("/fine-records/:borrow_id", librarianController.memberPayFinesController);

export default router;
