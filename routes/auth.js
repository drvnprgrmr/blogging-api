require("dotenv").config()

const express = require("express")
const authRouter = express.Router()

const jwt = require("jsonwebtoken")

const User = require("../models/user")


authRouter.post("/signup", async (req, res) => {
    const userDetails = req.body
    const { first_name, last_name, email, password } = userDetails 
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send({
            message: "Please enter all the required info"
        })
    }
    
    const user = new User({...userDetails})

    // Catch validation errors
    try {
        await user.validate()
    }
    catch (err) {
        return res.status(400).send(err)
    }

    // Catch other errors 
    try {
        await user.save()

        return res.send({
            message: "User created successfully",
            user
        })
        
    } catch (err) {
        res.status(500).send(err)
    }

})


authRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send({
            message: "Both email and password must be entered"
        })
    }

    const user = await User.findOne({
        email
    }).exec()

    if (!user) {
        return res.status(404).send({
            message: "User with that email not found."
        })
    }
    const passwordIsValid = await user.validatePassword(password)

    if (passwordIsValid) {
        const payload = {
            id: user._id
        }
        const JWT_SECRET = process.env.JWT_SECRET
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"})

        return res.send({
            message: "You've signed in successfully",
            token
        })
    } else {
        return res.status(401).send({
            message: "Your password is incorrect! Try again"
        })
    }

})


module.exports = authRouter