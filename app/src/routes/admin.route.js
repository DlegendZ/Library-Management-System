import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.post("/admins", adminController.registerAdminController);
router.post("/login", adminController.loginAdminController);
router.post("/refresh", adminController.refATController);
router.post("/logout", adminController.logoutAdminController);
router.post("/librarians", adminController.registerLibrarianController);
router.put("/roles", adminController.assignRolesController);
router.put("/status", adminController.assignStatusController);
router.get("/users", adminController.viewAllUsersController);
router.get(
  "/roles-assignments",
  adminController.viewRolesAssignmentsController,
);
router.get("/books", adminController.viewAllBooksController);
router.get("/categories", adminController.viewAllCategoriesController);
router.get("/borrow-records", adminController.viewBorrowRecordsController);
router.get("/fine-records", adminController.viewFineRecordsController);
router.get(
  "/member-borrow-history",
  adminController.viewMemberBorrowHistoryController,
);
router.get(
  "/books-borrowers",
  adminController.viewBooksWithBorrowersController,
);
router.get("/users-fine", adminController.viewUsersWithFinesController);
router.get("/users-status", adminController.viewUserByStatusController);
router.post("/books", adminController.addBookController);
router.put("/books/:book_id", adminController.updateBookController);
router.delete("/books/:book_id", adminController.deleteBookController);
router.post("/categories", adminController.addCategoryController);
router.put(
  "/categories/:category_id",
  adminController.updateCategoryController,
);

export default router;

// yang kurang :
// 2. validator dibenerin
// 3. authentikasi dibenerin
// 4. cek fungsi udh bener?
// 5. cek api udh bener?
// 6. cek respon udh bener? sama error responnya
// 7. cek business logic udh bener?
