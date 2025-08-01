const express = require("express")
const serverless = require("serverless-http")
const {
  uploadData,
  fetchLastData,
  fetchAllData,
  fetchLongestData,
  connectDB,
} = require("../database/database.js")
require("dotenv").config()


const app = express()
app.use(express.json())

// Ensure DB is connected before handling requests
connectDB()

app.get("/", (req, res) => {
  res.json({ message: "Server is running ✅" })
})

app.post("/upload", async (req, res) => {
  const { timestamp, duration } = req.body
  const api_key = req.get("X-ApiKey")

  const my_key = process.env.API_KEY
  
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }


  if (!timestamp || !duration) {
    return res.status(400).json({ error: "Missing timestamp or duration" })
  }

  try {
    await uploadData(timestamp, duration)
    res.status(200).json({ status: "ok", timestamp, duration })
  } catch (err) {
    console.error("Upload error:", err)
    res.status(500).json({ error: "Failed to upload data" })
  }
})

app.get("/last", async (req, res) => {
  const api_key = req.get("X-ApiKey")

  const my_key = process.env.API_KEY
   
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  try {
    const data = await fetchLastData()
    res.json(data)
  } catch (err) {
    console.error("Fetch last error:", err)
    res.status(500).json({ error: "Failed to fetch last data" })
  }
})

app.get("/all", async (req, res) => {
  const api_key = req.get("X-ApiKey")

  const my_key = process.env.API_KEY
  
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  try {
    const data = await fetchAllData()
    res.json(data)
  } catch (err) {
    console.error("Fetch all error:", err)
    res.status(500).json({ error: "Failed to fetch all data" })
  }
})

app.get("/long", async (req, res) => {
  const api_key = req.get("X-ApiKey")

  const my_key = process.env.API_KEY
  
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  try {
    const data = await fetchLongestData()
    res.json(data)
  } catch (err) {
    console.error("Fetch longest error:", err)
    res.status(500).json({ error: "Failed to fetch longest data" })
  }
})

// Export for Vercel
module.exports = app
module.exports.handler = serverless(app)
