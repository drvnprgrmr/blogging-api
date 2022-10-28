const express = require("express")
const Blog = require("../models/blog")

const writerRouter = express.Router()

writerRouter.post("/blog", async(req, res, next) => {
    const blogDetails = req.body
    
    // Get logged in user's id
    const userId = req.user.id

    try {
        /**
         * Calculate the reading time (in minutes) of the 
         * blog based on the length of the body.
         * 
         * Based on research the avg reading time is
         * about 200 words per minute.
         */
        const wordCount = blogDetails.body.split(/\s+/).length
        const reading_time = Math.floor(wordCount / 200)

        // Create the blog.
        const blog = new Blog({
            ...blogDetails,
            reading_time,
            author: userId
        })

        await blog.save()

        res.send({
            message: "Blog created successfully!",
            blog
        })

    } catch (err) {
        console.log(err)
        next(err)
    }
})

// Get all blogs by the logged in user.
// writerRouter.get("/blog", async(req, res) => {
//     // Get logged in user's id
//     const userId = req.user.id


// })




module.exports = writerRouter