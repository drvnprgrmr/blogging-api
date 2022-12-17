require("dotenv").config()

const mongoose = require("mongoose")

const logger = require("./logging/logger")

const MONGODB_URI = process.env.MONGODB_URI

const connectDB =  function() {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    
    mongoose.connection.on("connected", () => {
        logger.info("Connected to MongoDB successfully")
    })
    mongoose.connection.on("error", (err) => {
        logger.info("MongoDB encountered an error")
        logger.error(err)
    })
}


module.exports = connectDB