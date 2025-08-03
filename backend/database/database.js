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
    console.log("Connected to the database")
    return client
  } catch (err) {
    console.error("Database connection error:", err)
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
    console.log("tables outage and ping are ready");
  } catch (err) {
    console.error("failed to create tables: ", err);
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
    console.error("failed to upload data:", err)
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


const fetchDailyData = async () => {
  const db = await connectDB()
  let current_time = Math.floor(Date.now() / 1000);
  let duration = 86400;
  let range = current_time - duration;
  const res = await db.query("SELECT * FROM outage WHERE timestamp >= $1 ORDER BY timestamp DESC", [range])
  return res.rows
}


const fetchWeeklyData = async () => {
  const db = await connectDB()
  let current_time = Math.floor(Date.now() / 1000);
  let duration = 604800;
  let range = current_time - duration;
  const res = await db.query("SELECT * FROM outage WHERE timestamp >= $1 ORDER BY timestamp DESC", [range])
  return res.rows
}


const fetchMonthlyData = async () => {
  const db = await connectDB()
  let current_time = Math.floor(Date.now() / 1000);
  let duration = 2592000;
  let range = current_time - duration;
  const res = await db.query("SELECT * FROM outage WHERE timestamp >= $1 ORDER BY timestamp DESC", [range])
  return res.rows
}


const fetchLastPing = async () => {
  const db = await connectDB()
  const res = await db.query("SELECT * FROM ping ORDER BY timestamp DESC")
  return res.rows[0]
}


const handlePing = async () => {
  const db = await connectDB()
  const res = await db.query("SELECT * FROM ping ORDER BY timestamp DESC")
  let last_data = res.rows[0]
  let current_time = Math.floor(Date.now() / 1000);

  await db.query("UPDATE ping SET timestamp = $1, count = $2 WHERE timestamp = $3", [current_time, (last_data.count+1), last_data.timestamp])

  if ((current_time - last_data.timestamp) >= 70){
    try{
     await db.query("INSERT INTO outage (id, timestamp, duration) VALUES ($1, $2, $3)", [uuidv4(), current_time, (current_time - last_data.timestamp)])
    } catch (err) {
      console.log("insert failed: ", err)
      throw err
    }
  }
}


module.exports = {
  connectDB,
  createTable,
  uploadData,
  fetchLastData,
  fetchAllData,
  fetchDailyData,
  fetchWeeklyData,
  fetchMonthlyData,
  fetchLongestData,
  fetchLastPing,
  handlePing
}
