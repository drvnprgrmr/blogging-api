const morgan = require("morgan")
const logger = require("./logger")

const httpLogger = morgan("dev", {
    stream: {
        write: (message) => {
            logger.http(message)
        }
    }
})


module.exports = httpLogger