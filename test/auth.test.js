const request = require("supertest")

const app = require("../app.js")
const {connect, disconnect, cleanup} = require("./db.js")

describe("Auth routes", () => {
    let server
    beforeAll(async () => server = await connect())
    afterEach(async () =>  await cleanup())
    afterAll(async () => await disconnect(server))  

    it("Should login a user", async () => {
        const response = await request(app)
    })

})