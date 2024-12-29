const mongoose = require("mongoose");
mongoose.set("strictQuery", false); 
require("dotenv").config();

const url = process.env.DB_URL;

const db = async () => {
  try {
    
    await mongoose.connect(url);
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); 
  }
};

module.exports = db;
