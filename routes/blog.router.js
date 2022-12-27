const express = require("express")
const blogRouter = express.Router()

const { getAllBlogs, getBlog } = require("../controllers/blog.controller")

// Get all published blogs
blogRouter.get("/", getAllBlogs)

// Get a specific blog 
blogRouter.get("/:id", getBlog)


module.exports = blogRouter