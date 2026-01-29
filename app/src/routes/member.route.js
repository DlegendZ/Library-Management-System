import { Router } from "express";
import * as memberController from "../controllers/member.controller.js";

const router = Router();

router.get("/books", memberController.viewBooksController);
router.get("/borrow-records", memberController.viewMyBorrowHistoryController);
router.get("/fine-records", memberController.viewMyFineStatusController);

router.post("/borrow-records", memberController.borrowBookController);

router.put("/borrow-records/:borrow_id", memberController.returnBookController);

export default router;
