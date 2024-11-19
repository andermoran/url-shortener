require('dotenv').config();

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDb() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  if (!db) {
    await client.connect();
    db = client.db('Cluster0-url-shortener');
    console.log('Connected to MongoDB');
  }
  return db;
}

module.exports = connectToDb;
