import mongoose from 'mongoose';

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri) {
      console.log(`[Database] Connecting to MongoDB from environment URI...`);
      const conn = await mongoose.connect(uri);
      console.log(`[Database] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    }

    // Try default local MongoDB
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/aurelle_db', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] Connected to local MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      console.log(`[Database] Local MongoDB not running. Initializing in-memory MongoDB server for development...`);
    }

    // Fallback to in-memory MongoDB for zero-configuration instant local development
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 60000,
      },
    });
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[Database] Connected to in-memory MongoDB: ${memUri}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

export default connectDB;
