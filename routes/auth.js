const express = require("express")
const authRouter = express.Router()

const { signupUser, signinUser }  = require("../controllers/auth.controller.js")


authRouter.post("/signup", signupUser)

authRouter.post("/signin", signinUser)


module.exports = authRouter