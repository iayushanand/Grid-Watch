const { connectDB, createTable } = require("./database/database.js")
const app = require("./api/api.js")

const startServer = async () => {
  try {
    await connectDB()

    // await createTable()

    const PORT = 3000
    app.listen(PORT, () => {
      console.log(`Server running locally on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
}

startServer()
