const app = require("./app")
const request = require("supertest")
const mongoose = require("./db/connection")

// afterAll(() => mongoose.disconnect())

describe("Items routes", () => {
    test("Display all catalogue items", () => {
          request(app)
          .get("/api/v1/items")
          .end((err, res) => {
            expect(res.statusCode).toBe(404)
            expect("Content-Type", /json/)
            expect(res.body.length).not.toBe(0)
            expect(res.body).toBeInstanceOf(Array)
            expect(Object.keys(res.body[0])).toContain('name', 'price', 'image')
          })
    })
    // test("Raise error if cannot find individual item from the catalogue", async () => {
    //     const res = await request(app)
    //         .get("/api/v1/items/62c7c40a36d30ba0bec3617x")
    //         .expect(404)
    //         .expect("Content-Type", /json/)      
    //     expect(res.error).toBeDefined()
    // })
    // test("Add new item to catalogue", async () => {
    //     const res = await request(app).post("/api/v1/items").send({
    //         name: "cool t-shirt",
    //         price: 12.00,
    //         image: "https://cloudinary"
    //     })
    //     .expect(201)
    //     .expect("Content-Type", /json/)
    //     expect(res.body._id).toBeDefined()
    //     expect(res.body.name).toBe("cool t-shirt")
    //     expect(res.body.price).toEqual(12.00)
    //     expect(res.body.image).toBe("https://cloudinary")
    // })
    // test("Present error if required fields for new item are not entered or wrong data type", async () => {
    //     const res = await request(app)
    //       .post("/api/v1/items")
    //       .send({
    //         name: null,
    //         price: "wrong price",
    //         image: null,
    //       })
    //       .expect(400)
    //       .expect("Content-Type", /json/)
    //     expect(res.body._id).not.toBeDefined()
    })
// })