require("dotenv").config()

const express = require("express")
const passport = require("passport")


const authRouter = require("./routes/auth")
const blogRouter = require("./routes/blog")
const writerRouter = require("./routes/writer")

const connectDB = require("./db")
const authenticate = require("./auth")



const port = process.env.PORT || 3000
const app = express()

app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
    res.send("Welcome home")
})

app.use("/auth", authRouter)
app.use("/blog", blogRouter)
app.use(
    "/writer",
    authenticate,
    writerRouter
)

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).send({
        message: "Sorry, the route you requested does not exist!"
    })
    next()
})

// Error handler
app.use((err, req, res, next) => {
    res.status(500).send({
        message: "An error occured. Oops!",
        error: err
    })
})

app.listen(port, () => {
    console.log("App is listening on http://localhost:" + port)
})

connectDB()