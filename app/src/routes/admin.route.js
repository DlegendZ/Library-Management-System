import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.post("/register", adminController.registerAdminController);
router.post("/login", adminController.loginAdminController);
router.post("/refresh", adminController.refATController);
router.post("/logout", adminController.logoutAdminController);
router.post("/librarian", adminController.registerLibrarianController);
router.put("/roles", adminController.assignRolesController);
router.put("/status", adminController.assignStatusController);
router.get("/users", adminController.viewAllUsersController);
router.get("/rolls-assignments", adminController.viewRollAssignmentsController);
router.get("/books", adminController.viewAllBooksController);
router.get("/categories", adminController.viewAllCategoriesController);
router.get("/borrow-records", adminController.viewBorrowRecordsController);
router.get("/fine-records", adminController.viewFineRecordsController);
router.get(
  "/member-borrow-history",
  adminController.viewMemberBorrowHistoryController
);
router.get(
  "/books-borrowers",
  adminController.viewBooksWithBorrowersController
);
router.get("/users-fine", adminController.viewUsersWithFinesController);
router.get("/users-status", adminController.viewUserByStatusController);
router.post("/books", adminController.addBookController);
router.put("/books", adminController.updateBookController);
router.delete("/books", adminController.deleteBookController);
router.post("/categories", adminController.addCategoryController);
router.put("/categories", adminController.updateCategoryController);

export default router;
