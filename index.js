require("dotenv").config()

const app = require("./app")
const connectDB = require("./db")

const logger = require("./logging/logger")

const port = process.env.PORT || 3000

// Start application
app.listen(port, () => {
    logger.info("App is running on port ", port)
    console.log("App is running on port ", port)
    
})

// Connect to MongoDB instance
connectDB()