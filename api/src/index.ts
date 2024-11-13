import mongoose from "mongoose";
import app from "./app";
import env from "./utils/env";

const init = async () => {
  await mongoose.connect(env.MONGODB_URI);
  app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
};

init();
