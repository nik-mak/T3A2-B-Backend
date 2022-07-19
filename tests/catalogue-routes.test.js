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
})