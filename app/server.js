import express from "express";
import "dotenv/config";
import adminRoute from "./src/routes/admin.route.js";
import librarianRoute from "./src/routes/librarian.route.js";
import memberRoute from "./src/routes/member.route.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.use("/admin", adminRoute);
app.use("/librarian", librarianRoute);
app.use("/member", memberRoute);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT http://localhost:${PORT}`);
});
