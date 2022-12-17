const morgan = require("morgan")
const logger = require("./logger")

const httpLogger = morgan("tiny", {
    stream: {
        write: (message) => {
            logger.http(message)
        }
    }
})


module.exports = httpLogger