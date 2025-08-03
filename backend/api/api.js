const express = require("express")
const serverless = require("serverless-http")
const {
  uploadData,
  fetchLastData,
  fetchAllData,
  fetchDailyData,
  fetchWeeklyData,
  fetchMonthlyData,
  fetchLongestData,
  fetchLastPing,
  connectDB,
  handlePing,
} = require("../database/database.js")
require("dotenv").config()


const my_key = process.env.API_KEY
const app = express()
app.use(express.json())


app.get("/", (req, res) => {
  res.json({ message: "server is running" })
})


app.get("/ping", async (req, res) => {
  const api_key = req.get("X-ApiKey")
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
    await handlePing();
    res.json({message: "Pinged successfully!"})
})


app.post("/upload", async (req, res) => {
  const api_key = req.get("X-ApiKey")
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  
  const { timestamp, duration } = req.body

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


app.get("/daily", async (req, res) => {
  const api_key = req.get("X-ApiKey")
  
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  try {
    const data = await fetchDailyData()
    res.json(data)
  } catch (err) {
    console.error("Fetch all error:", err)
    res.status(500).json({ error: "Failed to fetch all data" })
  }
})


app.get("/weekly", async (req, res) => {
  const api_key = req.get("X-ApiKey")
  
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  try {
    const data = await fetchWeeklyData()
    res.json(data)
  } catch (err) {
    console.error("Fetch all error:", err)
    res.status(500).json({ error: "Failed to fetch all data" })
  }
})


app.get("/monthly", async (req, res) => {
  const api_key = req.get("X-ApiKey")
  
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  try {
    const data = await fetchMonthlyData()
    res.json(data)
  } catch (err) {
    console.error("Fetch all error:", err)
    res.status(500).json({ error: "Failed to fetch all data" })
  }
})


app.get("/lastping", async (req, res) => {
  const api_key = req.get("X-ApiKey")
  
  if (my_key !== api_key){
    return res.status(403).json({error: "Wrong API Key"})
  }
  try {
    const data = await fetchLastPing()
    res.json(data)
  } catch (err) {
    console.error("Fetch all error:", err)
    res.status(500).json({ error: "Failed to fetch all data" })
  }
})


app.get("/long", async (req, res) => {
  const api_key = req.get("X-ApiKey")

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


module.exports = app
module.exports.handler = serverless(app)