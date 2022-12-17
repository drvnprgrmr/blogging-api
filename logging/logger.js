const winston = require("winston")
const { createLogger, format, transports } = require("winston")


const logger = createLogger({
    levels: winston.config.npm.levels,
    // Add timestamps to all logs
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        // App log
        new transports.File({
            level: "debug",
            filename: "logs/app.log",
            maxFiles: 5,
            maxSize: 5242880,  // 5MB
        }),
        // Error Logs
        new transports.File({
            level: "error",
            filename: "logs/error.log",
        }),
    ],
    exceptionHandlers: [
        // Log exceptions
        new transports.File({filename: "logs/exceptions.log"})
    ],
    exitOnError: false
})



module.exports = logger