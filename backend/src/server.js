import express from "express";
import morgan from "morgan";
import "dotenv/config";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
