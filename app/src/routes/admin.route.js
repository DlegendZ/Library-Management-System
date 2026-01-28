import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();
// router.post("/login", adminController.loginAdminController);
// router.post("/refresh", adminController.refATController);
// router.post("/logout", adminController.logoutAdminController);

router.get("/users", adminController.viewAllUsersController);
router.get("/roles", adminController.viewRolesAssignmentsController);
router.get("/books", adminController.viewAllBooksController);
router.get("/categories", adminController.viewAllCategoriesController);
router.get("/borrow-records", adminController.viewBorrowRecordsController);
router.get("/fine-records", adminController.viewFineRecordsController);
router.get("/members/:user_id/borrow-records", adminController.viewMemberBorrowHistoryController);
router.get("/books/borrowers", adminController.viewBooksWithBorrowersController);
router.get("/users/fines", adminController.viewUsersWithFinesController);
router.get("/users/status", adminController.viewUserByStatusController);

router.post("/admins", adminController.registerAdminController);
router.post("/librarians", adminController.registerLibrarianController);
router.post("/books", adminController.addBookController);
router.post("/categories", adminController.addCategoryController);

router.put("/users/roles/:user_id", adminController.assignRolesController);
router.put("/users/status/:user_id", adminController.assignStatusController);
router.put("/books/:book_id", adminController.updateBookController);
router.put("/fine-records/:borrow_id", adminController.memberPayFinesController);

router.delete("/books/:book_id", adminController.deleteBookController);

export default router;

// yang kurang :
// 2. validator dibenerin? done
// 3. authentikasi dibenerin? done
// 4. cek fungsi udh bener? done
// 5. cek api udh bener? done
// 6. cek respon udh bener? sama error responnya
// 7. cek business logic udh bener? done
