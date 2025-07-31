const { connectDB, createTable } = require("./database/database.js")
const { run } = require("./api/api.js")

const startServer = async () => {
  try {
    await connectDB()
    // Uncomment this only for the first-time table creation
    // await createTable()

    run()
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
}

startServer()
