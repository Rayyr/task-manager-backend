import dotenv from "dotenv";
import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.js";

//load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
};

start();
