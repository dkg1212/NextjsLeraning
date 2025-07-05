/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Global cache to reuse the connection across requests
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "next-auth",       // use your db name
      bufferCommands: false,     // avoids silent failure
    });
  }

  try {
    cached.conn = await cached.promise;

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });

    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}
