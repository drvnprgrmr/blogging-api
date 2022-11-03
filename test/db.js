const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")

async function connect() {
    // Create new mongod instance
    const server = await MongoMemoryServer.create()
    const uri = server.getUri("jest")

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    
    return server
}

async function disconnect(server) {
    await mongoose.disconnect()
    await server.stop()
}

async function cleanup() {
    await mongoose.connection.dropDatabase()
}

module.exports = {
    connect,
    disconnect,
    cleanup
}