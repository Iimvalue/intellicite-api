
 import mongoose from "mongoose";

 export const connectDB = async (): Promise<void> => {
   try {
     const mongoURI = process.env.MONGODB_URI;
     const dbName = process.env.DB_NAME || 'intellicite-api';
     
     if (!mongoURI) {
       console.log('MONGODB_URI is not defined');
       process.exit(1);
     }
     
     await mongoose.connect(mongoURI, {
       dbName: dbName
     });
     console.log(`MongoDB connected successfully to database: ${dbName}`);
   } catch (error) {
     console.log("MongoDB connection error:", error);
     process.exit(1);
   }
 };

//  export const deleteAllCollections = async (): Promise<void> => {
//    const collections = mongoose.connection.collections;
//    if (!collections) {
//      console.log("No collections found");
//      return;
//   }
//    for (const collection of Object.values(collections)) {
//      await collection.drop();
//   }
//   console.log("All collections dropped");
// };
