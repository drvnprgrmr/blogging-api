const express = require("express")
const writerRouter = express.Router()

const { createBlog, getUserBlog, editBlog, deleteBlog, publishBlog } = require("../controllers/writer.controller")

// Create a new blog
writerRouter.post("/blog", createBlog)

// Get all blogs by the logged in user
writerRouter.get("/blog", getUserBlog)

// Publish a blog
writerRouter.patch("/publish/:id", publishBlog)

// Edit a blog
writerRouter.patch("/edit/:id", editBlog)

// Delete a blog
writerRouter.delete("/blog/:id", deleteBlog)

module.exports = writerRouter