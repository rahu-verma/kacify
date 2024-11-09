import express from "express";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT;

app.get("/version", (req, res) => {
  res.send("1.0.0");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
