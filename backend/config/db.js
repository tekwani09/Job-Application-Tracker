const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //console.log("MONGO_URL:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");

  } catch (error) {
    console.error("MongoDB Error:", error.message);
  }
};

module.exports = connectDB;
