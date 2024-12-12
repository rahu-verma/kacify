import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const init = async () => {
  if (process.env.MONGODB_URI && process.env.PORT) {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  } else {
    console.error("Missing environment variables");
  }
};

init();
