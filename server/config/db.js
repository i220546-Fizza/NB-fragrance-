const mongoose = require('mongoose');

// Hard-pin this app to its own database, regardless of what database name
// (if any) is embedded in MONGO_URI. This is what actually keeps this app's
// data isolated from other apps that might share the same MongoDB cluster -
// a cluster is just a server; two apps pointed at the same cluster but
// different dbName values still have completely separate collections, with
// no possibility of cross-reads even if someone pastes the wrong URI.
const DB_NAME = 'nb_classic_scents';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(uri, { dbName: DB_NAME });
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
