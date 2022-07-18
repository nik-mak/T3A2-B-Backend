const app = require("../app");
const request = require("supertest");

describe("Authentication Routes", () => {
  test("Identifies existing registered email", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "John Smith",
        email: "test@test.com",
        password: "123",
      })
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
