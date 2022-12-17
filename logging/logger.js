const { createLogger, format, transports } = require("winston")



const logger = createLogger({
    levels: config.npm.levels,
    // Add timestamps to all logs
    format: format.timestamp(),
    transports: [
        // App log
        new transports.File({
            level: "debug",
            filename: "../logs/app.log",
        }),
        // HTTP Logs
        new transports.File({
            level: "http",
            filename: "../logs/http.log",
            maxFiles: 5,
            maxSize: 5242880,  // 5MB
        }),
        // Error Logs
        new transports.File({
            level: "error",
            filename: "../logs/error.log",
        }),
    ],
    exceptionHandlers: [
        // Log exceptions
        new transports.File({filename: "../logs/exceptions.log"})
    ],
    exitOnError: false
})



module.exports = logger