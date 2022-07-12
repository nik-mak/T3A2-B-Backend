const app = require("../app");
const request = require("supertest");

describe("Authentication Routes", () => {
  test("POST /register", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "John Smith",
        email: "test@test.com",
        password: "123",
      })
      .end((err, res) => {
        expect(res.statusCode).toBe(1231);
        done();
      });
  });
});
