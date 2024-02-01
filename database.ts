import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.MONGO_DBNAME as string,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1); // Exit the process with a failure code
  }
};

export { connectDatabase };
