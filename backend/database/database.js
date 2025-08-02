const { Pool } = require("pg")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config()

let client = null

const connectDB = async () => {
  if (client) return client

  try {
    client = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    await client.connect()
    console.log("✅ Connected to the database")
    return client
  } catch (err) {
    console.error("❌ Database connection error:", err)
    throw err
  }
}

const createTable = async () => {
  const db = await connectDB();
  const query = `
    CREATE TABLE IF NOT EXISTS outage (
      id UUID PRIMARY KEY,
      timestamp INT NOT NULL,
      duration INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ping (
      timestamp INT NOT NULL,
      count INT NOT NULL
    );
  `;

  try {
    await db.query(query);
    console.log("✅ Tables 'outage' and 'ping' are ready");
  } catch (err) {
    console.error("❌ Failed to create tables:", err);
    throw err;
  }
};


const uploadData = async (timestamp, duration) => {
  const db = await connectDB()
  const query = `
    INSERT INTO outage (id, timestamp, duration)
    VALUES ($1, $2, $3)
  `
  try {
    await db.query(query, [uuidv4(), timestamp, duration])
  } catch (err) {
    console.error("❌ Failed to upload data:", err)
    throw err
  }
}

const fetchLastData = async () => {
  const db = await connectDB()
  const query = `
    SELECT * FROM outage ORDER BY timestamp DESC LIMIT 1
  `
  const res = await db.query(query)
  return res.rows[0] || null
}

const fetchLongestData = async () => {
  const db = await connectDB()
  const query = `
    SELECT * FROM outage ORDER BY duration DESC LIMIT 1
  `
  const res = await db.query(query)
  return res.rows[0] || null
}

const fetchAllData = async () => {
  const db = await connectDB()
  const res = await db.query("SELECT * FROM outage ORDER BY timestamp DESC")
  return res.rows
}

module.exports = {
  connectDB,
  createTable,
  uploadData,
  fetchLastData,
  fetchAllData,
  fetchLongestData,
}
