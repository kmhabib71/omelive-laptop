const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let isConnectedBefore = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Retry time limit in ms
    });
    isConnectedBefore = true;
    console.log("MongoDB connected");

    mongoose.connection.on("disconnected", () => {
      isConnectedBefore = false;
      console.log("MongoDB disconnected! Attempting to reconnect...");
      reconnectDB();
    });

    mongoose.connection.on("reconnected", () => {
      isConnectedBefore = true;
      console.log("MongoDB reconnected!");
    });

    mongoose.connection.on("error", (err) => {
      isConnectedBefore = false;
      console.error("MongoDB error:", err.message);
    });
  } catch (err) {
    isConnectedBefore = false;
    console.error("Initial connection error:", err.message);
    setTimeout(reconnectDB, 5000); // Retry connection after 5 seconds
  }
};

const reconnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedBefore = true;
    console.log("MongoDB reconnected!");
  } catch (err) {
    isConnectedBefore = false;
    console.error("Reconnection error:", err.message);
    setTimeout(reconnectDB, 5000); // Retry connection after 5 seconds
  }
};

module.exports = {
  connectDB,
  isConnectedBefore: () => isConnectedBefore,
};
