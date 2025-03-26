import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error("MONGO_DB_URI is not defined in the .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error Connecting MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
