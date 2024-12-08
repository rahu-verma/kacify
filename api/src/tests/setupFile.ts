import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

export const baseUrl = `http://localhost:${process.env.PORT}`;
