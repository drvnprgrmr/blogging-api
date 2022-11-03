require("dotenv").config()

const app = require("./app")
const connectDB = require("./db")

const port = process.env.PORT || 3000

// Start application
app.listen(port, () => {
    console.log("App is listening on http://localhost:" + port)
})

// Connect to MongoDB instance
connectDB()