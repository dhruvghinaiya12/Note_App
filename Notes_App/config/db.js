const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Make sure strictQuery is set before using mongoose
require("dotenv").config();

const url = process.env.DB_URL;

const db = async () => {
  try {
    // Including some options for connection
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = db;
