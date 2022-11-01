const express = require("express")
const Blog = require("../models/blog")

const writerRouter = express.Router()

// Create a new blog
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
        const reading_time = Math.floor(wordCount / 200) || 1

        // Split the tags on spaces or commas
        const tags = blogDetails.tags.split(/\s+|\s*,\s*/)

        // Create the blog.
        const blog = new Blog({
            ...blogDetails,
            author: userId,
            reading_time,
            tags
        })

        await blog.save()

        res.status(201).send({
            message: "Blog created successfully!",
            blog
        })

    } catch (err) {
        next(err)
    }
})

// Get all blogs by the logged in user
writerRouter.get("/blog", async(req, res, next) => {
    // Get logged in user's id
    const userId = req.user.id

    const query = req.query

    try {
        const filterQuery = {}

        // Filter by state
        const state = query.state
        state ? (filterQuery.state = state) : null

        const writerBlogs = await Blog.find({
            author: userId,
            ...filterQuery
        }).exec()

        // Handle pagination
        const pageSize = +query.pageSize || 20
        const page = +query.page || 1
        const start = (page - 1) * pageSize
        const end = page * pageSize

        const pagedBlogs = writerBlogs.slice(start, end)

        res.send({
            message: "Successful!",
            total: writerBlogs.length,
            page,
            pageSize,
            blogs: pagedBlogs
        })
        
    } catch (err) {
        next(err)
    }

})

// Publish a blog
writerRouter.patch("/publish/:id", async(req, res, next) => {
    const blogId = req.params.id

    try {
        const blog = await Blog.findById(blogId).exec()

        if (!blog) {
            return res.status(404).send({
                message: "Blog not found!"
            })
        }

        if (blog.state === "published") {
            return res.send({
                message: "This blog has already been published!"
            })
        }

        blog.state = "published"

        await blog.save()

        res.send({
            message: "Your blog has been published!",
            blog
        })
    } catch (err) {
        next(err)
    }
})

// Edit a blog
writerRouter.patch("/edit/:id", async(req, res, next) => {
    const blogId = req.params.id

    // Get possible fields to be updated
    const title = req.body.title
    const description = req.body.description
    const tags = req.body.tags
    const body = req.body.body

    try {
        const blog = await Blog.findById(blogId).exec()

        if (!blog) {
            return res.status(404).send({
                message: "Blog not found!"
            })
        }
        
        // Update blog based on values
        title ? (blog.title = title) : null
        description ? (blog.description = description) : null
        tags ? (blog.tags = tags.split(/\s+|\s*,\s*/)) : null
        body ? (blog.body = body) : null
        
        // Calculate new reading_time of blog
        const wordCount = body.split(/\s+/).length
        const reading_time = Math.floor(wordCount / 200) || 1
        blog.reading_time = reading_time

        // Update last_modified to current time
        blog.last_modified = Date.now()


        await blog.save()

        return res.send({
            message: "Blog updated successfully!",
            blog
        })

    } catch (err) {
        next(err)
    }
})

// Delete a blog
writerRouter.delete("/blog/:id", async(req, res, next) => {
    const blogId = req.params.id

    try {
        const blog = await Blog.findById(blogId).exec()

        if (!blog) {
            return res.status(404).send({
                message: "Blog not found!"
            })
        }

        // Delete the blog
        await Blog.deleteOne({_id: blogId})

        res.send({
            message: "Blog deleted successfully!",
            blog
        })
        
    } catch (err) {
        next(err)
    }
})

module.exports = writerRouter