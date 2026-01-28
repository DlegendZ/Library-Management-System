import { Router } from "express";
import * as memberController from "../controllers/member.controller.js";

const router = Router();

router.get("/books", memberController.viewBooksController); //done
router.get("/members/:user_id/borrow-records", memberController.viewMyBorrowHistoryController);
router.get("/members/:user_id/fine-records", memberController.viewMyFineStatusController);

router.post("/borrow-records", memberController.borrowBookController);

router.put("/members/:user_id/borrow-records/:borrow_id", memberController.returnBookController);

export default router;
