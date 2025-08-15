import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.BACKEND_PORT;

const app = express();

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
