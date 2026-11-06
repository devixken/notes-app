import mongoose from "mongoose";

export async function connectToDatabase(uri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("Connected to MongoDB");
}

export async function disconnectFromDatabase() {
  await mongoose.connection.close();
  console.log("Disconnected from MongoDB");
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
