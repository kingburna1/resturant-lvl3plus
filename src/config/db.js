import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let cached = global._mongoClientPromise;

const connectDB = async () => {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is missing in environment');
  }

  if (!cached) {
    cached = { conn: null, promise: null };
    global._mongoClientPromise = cached;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, { bufferCommands: false }).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected with Mongoose');
    return cached.conn;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message || err);
    // Do not exit the process; throw so callers can handle and return proper HTTP errors
    throw err;
  }
};

export default connectDB;
