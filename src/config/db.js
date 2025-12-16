import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = async () => {
  try {
    // Check for the correct variable name
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is missing in .env file");
    }

    // Use the correct variable name here too
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log("✅ MongoDB connected with Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
