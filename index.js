require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

const app = express()

const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
    res.send("Welcome home")
})

app.listen(port, () => {
    console.log("App is listening on http://localhost:" + port)
})