import mongoose from "mongoose";
import { Settings } from "./settings";

// Global setting: Strip non-schema fields from queries
mongoose.set("strictQuery", true);

export const connectDB = async () => {
  if (!Settings.MONGO_URI) return console.log("MongoDB URI not provided!".red);

  const conn = await mongoose.connect(Settings.MONGO_URI!, {
    autoIndex: false, // TODO: change this to true or uncomment it before deployment
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
};
