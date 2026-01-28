import express from "express";
import dotenv from "dotenv";
import adminRoute from "./src/routes/admin.route.js";
import librarianRoute from "./src/routes/librarian.route.js";
import memberRoute from "./src/routes/member.route.js";
import authRoute from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import * as authControllers from "./src/controllers/auth.controllers.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(
  "/admin",
  authControllers.requireAccessTokenController,
  authControllers.requireAdmin,
  adminRoute,
);
app.use(
  "/librarian",
  authControllers.requireAccessTokenController,
  authControllers.requireLibrarian,
  librarianRoute,
);
app.use(
  "/member",
  authControllers.requireAccessTokenController,
  authControllers.requireMember,
  memberRoute,
);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT http://localhost:${PORT}`);
});
