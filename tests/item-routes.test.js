const app = require("../app");
const mongoose = require("mongoose");
const session = require("supertest-session")

let testSession = null
let authenticatedSession = null

beforeAll(() => {
  testSession = session(app)
})

beforeAll((done) => {
  testSession
    .post("/api/v1/auth/login")
    .send({ email: "user01@gmail.com", password: "password123" })
    .expect(200)
    .end((err) => {
      if (err) return done(err)
      authenticatedSession = testSession
      return done()
    })
})

afterAll(() => mongoose.connection.close());

describe("Items routes", () => {
  test("Raise error if cannot find individual item from the catalogue", (done) => {
    authenticatedSession
      .get("/api/v1/items/1234567")
      .expect(404, { error: "Enable to find item with id 1234567" })
      .expect("Content-Type", /json/)
      .end(done)
  });
  test("Raise error if cannot find individual item from the catalogue", (done) => {
    authenticatedSession
      .get("/api/v1/items/1234567")
      .expect(404, { error: "Enable to find item with id 1234567" })
      .expect("Content-Type", /json/)
      .end(done);
  });
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
});