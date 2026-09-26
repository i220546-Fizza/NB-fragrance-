const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('----------------------------------------------------');
    console.error('MongoDB connection FAILED.');
    console.error(`Reason: ${error.message}`);
    console.error('Make sure MongoDB is running and MONGO_URI in your .env');
    console.error('file points to a reachable database (see .env.example).');
    console.error('----------------------------------------------------');
    process.exit(1);
  }
};

module.exports = connectDB;
