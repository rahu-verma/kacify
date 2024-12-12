import mongoose from "mongoose";
import { env } from "process";

beforeAll(async () => {
  await mongoose.connect(env.TEST_MONGODB_URI!);
});
