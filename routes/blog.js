const express = require("express")
const Blog = require("../models/blog")

const blogRouter = express.Router()

blogRouter.get("/", async(req, res) => {
    const filterQuery = {}
    const sortQuery = {}

    // Filter/search params
    const author = req.params.author
    const title = req.params.title
    const tags = req.params.tags

    // Order/sorting params
    const read_count = req.params.read_count
    const reading_time = req.params.reading_time
    const timestamp = req.params.timestamp

    // Handle possible filters
    author ? (filterQuery.author = author) : null
    title ? (filterQuery.title = title) : null
    if (tags) {
        filterQuery.tags = {}
        filterQuery.tags.$all = tags.split(",")
    }

    // Handle sort params
    const allowedSortValues = ["asc", "desc", "ascending", "descending", 1, -1]
    allowedSortValues.includes(read_count) ? (sortQuery.read_count = read_count) : null
    allowedSortValues.includes(reading_time) ? (sortQuery.reading_time = reading_time) : null
    allowedSortValues.includes(timestamp) ? (sortQuery.timestamp = timestamp) : null


    const publishedBlogs = await Blog.find({
        state: "published"
    })
    .populate("author")
    .sort(sortQuery)
    .exec()


})

blogRouter.get("/:id", async(req, res, next) => {
    const id = req.params.id

    try {
        const blog = await Blog.findById(id).exec()
        res.send(blog)

    } catch (err) {
        next(err)
    }
})


module.exports = blogRouter