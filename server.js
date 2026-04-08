import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/db/connectDb.js";

dotenv.config();

app.listen(3000, async () => {
  await connectDb();
  console.log("Server is running on port 3000");
});
