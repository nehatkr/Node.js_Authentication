require('dotenv').config();
const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb connected successfully")
  } catch (e) {
    console.log("MongoDB connection Failed");
    process.exit(1);
  }
};
module.exports = connectToDB;