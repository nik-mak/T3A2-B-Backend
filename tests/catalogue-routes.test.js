const app = require("../app")
const request = require("supertest")
const mongoose = require("mongoose")


afterAll(() => mongoose.connection.close())

describe("Catalogue route", () => {
  it("Display all available catalogue items", async () => {
    const res = await request(app)
      .post("/api/v1/catalogue")
      .send({
        page: "1",
        amount: "2"
      })
      .set("Accept", "application/json");
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.status).toEqual(200)
    expect(res.body.length).not.toBe(0);
    expect(Object.keys(res.body)).toContain(
      "results",
      "totalPages"
    );
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
    // })
})