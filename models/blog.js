const { Schema, model } = require("mongoose")
const User = require("./user")

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    state: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },
    read_count: {
        type: Number,
        default: 0,
        min: 0,
    },
    reading_time: Number,
    tags: [String],
    body: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    last_modified: {
        type: Date,
        default: Date.now,
    }
})

// Create index on tags path 
blogSchema.index({ tags: 1 })


const Blog = model("Blog", blogSchema)
module.exports = Blog