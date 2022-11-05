const request = require("supertest")

const app = require("../app.js")
const Blog = require("../models/blog")
const { connect, disconnect } = require("./db.js")

let server
let token
beforeAll(async () => {
    // Create mongodb test server
    server = await connect()

    /**
     * Create a user to test with 
     * and get token to use for authentication
     */
    await request(app)
        .post("/auth/signup")
        .type("form")
        .send({
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@test.com",
            password: "password"
        })

    // Sign in and get token
    const response = await request(app)
        .post("/auth/signin")
        .type("form")
        .send({
            email: "johndoe@test.com",
            password: "password"
        })

    token = response.body.token

})
afterAll(async () => await disconnect(server))


let blogId   // Variable to hold created blog's id
describe("Create a new blog", () => {
    it("Should create successfully", async () => {
        const response = await request(app)
            .post("/writer/blog")
            .type("form")
            .auth(token, { type: "bearer" })
            .send({
                title: "A blog",
                description: "For testing purposes",
                body: "Hello world!",
                tags: "test"
            })

        expect(response.status).toEqual(201)
        expect(response.body).toHaveProperty("message", "Blog created successfully!")
        expect(response.body).toHaveProperty("blog")
        // Save blog's id
        blogId = response.body.blog._id
    })

    it("Should throw error if no token", async () => {
        const response = await request(app)
            .post("/writer/blog")
            .type("form")
            .send({
                title: "A blog",
                description: "For testing purposes",
                body: "Hello world!",
                tags: "test"
            })
        
        expect(response.status).toEqual(500)
        expect(response.error).toBeDefined()
        expect(response.error.text).toMatch("Error: No auth token")

    })

    
})

test("Get all blogs by the logged in user", async () => {
    const response = await request(app)
        .get("/writer/blog")
        .auth(token, { type: "bearer" })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty("message", "Successful!")
    expect(response.body).toHaveProperty("blogs")
    expect(response.body.blogs.length).toEqual(1)
})


test("Publish a blog", async () => {
    const response = await request(app)
        .patch(`/writer/publish/${blogId}`)
        .auth(token, { type: "bearer" })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty("message", "Your blog has been published!")
    expect(response.body).toHaveProperty("blog")
    expect(response.body.blog.state).toEqual("published")
})


test("Edit a blog", async () => {
    const response = await request(app)
        .patch(`/writer/edit/${blogId}`)
        .auth(token, { type: "bearer" })
        .type("form")
        .send({
            title: "My edited blog",
            description: "Test if edit works",
            body: "Hello fellow programmers!",
            tags: "test, edited"
        })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty("message", "Blog updated successfully!")
    expect(response.body).toHaveProperty("blog")
    expect(response.body.blog.state).toEqual("published")
})


test("Delete a blog", async () => {
    const response = await request(app)
        .delete(`/writer/blog/${blogId}`)
        .auth(token, { type: "bearer" })

    // Get all blogs
    const blogs = await Blog.find({})

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty("message", "Blog deleted successfully!")
    // Test if blog was actually deleted
    expect(blogs.length).toEqual(0)
})
