require("dotenv").config()

const express = require("express")

const authRouter = require("./routes/auth")
const blogRouter = require("./routes/blog")
const writerRouter = require("./routes/writer")

const authenticate = require("./auth")


const app = express()

app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.urlencoded({extended: false}))
app.use("/", express.static(__dirname + "/public"))

// EJS Views
app.get("/", (req, res) => {
    res.render("home")
})
app.get("/signup", (req, res) => {
    res.render("signup")
})
app.get("/signin", (req, res) => {
    res.render("signin")
})

// API Routes
app.use("/auth", authRouter)
app.use("/blog", blogRouter)
app.use("/writer", authenticate, writerRouter)

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).send({
        message: "Sorry, the route you requested does not exist!"
    })
    next()
})

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        message: "An error occured. Oops!",
        error: err.toString()
    })
})


module.exports = app