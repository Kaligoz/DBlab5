const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Admin:admin@cluster0.uzdoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Use your MongoDB connection string here
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Return both db and client
    const db = client.db('GameDB'); // Replace with your database name
    return { db, client };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    return null; // Return null if connection fails
  }
}

module.exports = connectDB; // Export connectDB directly
