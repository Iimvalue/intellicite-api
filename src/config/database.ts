/**
 * This file is responsible for connecting to the MongoDB database.
 * uses .env file for configuration.
 */

// import mongoose from "mongoose";

// export const connectDB = async (): Promise<void> => {
//   try {
//     const mongoURI = process.env.MONGODB_URI;
//     if (!mongoURI) {
//         console.log('\x1b[31m%s\x1b[0m', 'MONGODB_URI is not defined');      process.exit(1);
//     }
//     await mongoose.connect(mongoURI);
//     console.log('\x1b[32m%s\x1b[0m', 'MongoDB connected successfully');  } catch (error) {
//     console.log("MongoDB connection error:", error);
//     process.exit(1);
//   }
// };

// export const deleteAllCollections = async (): Promise<void> => {
//   const collections = mongoose.connection.collections;
//   if (!collections) {
//     console.log("No collections found");
//     return;
//   }
//   for (const collection of Object.values(collections)) {
//     await collection.drop();
//   }
//   console.log("All collections dropped");
// };
