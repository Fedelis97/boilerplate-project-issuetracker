const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

let mongoServer;
let client;
let db;

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create(); // Avvia il database mock in memoria
  const uri = mongoServer.getUri();
  client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db("test-db"); // Nome del database temporaneo
  console.log("✅ Connessione a MongoDB (Mock) stabilita");
  return db;
};

const closeDB = async () => {
  if (client) await client.close();
  if (mongoServer) await mongoServer.stop();
  console.log("🛑 Database chiuso dopo i test");
};

const getDB = () => db;

module.exports = { connectDB, closeDB, getDB };