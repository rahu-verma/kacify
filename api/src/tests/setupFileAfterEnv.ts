import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await new Promise((r) => setTimeout(r, 1000));
});

afterAll(async () => {
  await mongoose.connection.close();
});
