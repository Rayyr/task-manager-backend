import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not declared in .env file");
    process.exit(1);
  } 
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection is faild : ", error.message);
    process.exit(1);
  }
};
