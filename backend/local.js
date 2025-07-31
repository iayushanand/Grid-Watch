const { connectDB } = require("./database/database.js")
const app = require("./api/api.js")  // This is the Express app

const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Server running locally on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
}

startServer()
