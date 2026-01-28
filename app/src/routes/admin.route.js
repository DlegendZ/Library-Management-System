import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", adminController.viewAllUsersController);
router.get("/roles", adminController.viewRolesAssignmentsController);
router.get("/books", adminController.viewAllBooksController);
router.get("/categories", adminController.viewAllCategoriesController);
router.get("/borrow-records", adminController.viewBorrowRecordsController);
router.get("/fine-records", adminController.viewFineRecordsController);
router.get("/members/:user_id/borrow-records", adminController.viewMemberBorrowHistoryController);
router.get("/books/members", adminController.viewBooksWithBorrowersController);
router.get("/users/fine-records", adminController.viewUsersWithFinesController);

router.post("/admins", adminController.registerAdminController);
router.post("/librarians", adminController.registerLibrarianController);
router.post("/books", adminController.addBookController);
router.post("/categories", adminController.addCategoryController);

router.put("/users/:user_id", adminController.assignUserInfoController);
router.put("/books/:book_id", adminController.updateBookController);
router.put("/fine-records/:borrow_id", adminController.memberPayFinesController);

router.delete("/books/:book_id", adminController.deleteBookController);

export default router;
