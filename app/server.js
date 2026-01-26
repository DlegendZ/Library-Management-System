import express from "express";
import dotenv from "dotenv";
import adminRoute from "./src/routes/admin.route.js";
import librarianRoute from "./src/routes/librarian.route.js";
import memberRoute from "./src/routes/member.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use("/admin", adminRoute);
app.use("/librarian", librarianRoute);
app.use("/member", memberRoute);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT http://localhost:${PORT}`);
});
