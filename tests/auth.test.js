const request = require("supertest")

const app = require("../app.js")
const {connect, disconnect, cleanup} = require("./db.js")

// Handle test database 
let server
beforeAll(async () => server = await connect())
afterEach(async () =>  await cleanup())
afterAll(async () => await disconnect(server))

describe("Signup", () => {
    it("Should signup a user", async () => {
        const response = await request(app)
            .post("/auth/signup")
            .type("form")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@test.com",
                password: "password"
            })

        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty("message", "User created successfully");
        expect(response.body).toHaveProperty("user");
    })

    it("Should reject if details are incomplete", async () => {
        const response = await request(app)
            .post("/auth/signup")
            .type("form")
            .send({
                first_name: "John",
                last_name: "Doe"
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Please enter all the required info")
    })

})

describe('Signin', () => {
    beforeEach(async () => {
        // Create a user to test with
        await request(app)
        .post("/auth/signup")
        .type("form")
        .send({
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@test.com",
            password: "password"
        })
    })
    it("Should signin successfully", async () => {
        const response = await request(app)
            .post("/auth/signin")
            .type("form")
            .send({
                email: "johndoe@test.com",
                password: "password"
            })

        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty("message", "You've signed in successfully")
        expect(response.body).toHaveProperty("token")

    })

    it("Should reject if email and password are not included", async () => {
        const response = await request(app)
            .post("/auth/signin")
            .type("form")
            .send({
                email: "johndoe@test.com"
            })

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty("message", "Both email and password must be entered")
    })

    it("Should reject for wrong email", async () => {
        const response = await request(app)
            .post("/auth/signin")
            .type("form")
            .send({
                email: "doesnotexist@test.com",
                password: "password"
            })

        expect(response.status).toEqual(404)
        expect(response.body).toHaveProperty("message", "User with that email not found.")
    })

    it("Should reject for wrong password", async () => {
        const response = await request(app)
            .post("/auth/signin")
            .type("form")
            .send({
                email: "johndoe@test.com",
                password: "pa$$word"
            })

        expect(response.status).toEqual(401)
        expect(response.body).toHaveProperty("message", "Your password is incorrect! Try again")
    })
});