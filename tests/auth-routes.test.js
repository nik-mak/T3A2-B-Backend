const app = require("../app");
const request = require("supertest");
const session = require("supertest-session");


beforeAll((done) => {
  testSession = session(app);
  // creating a mock user for the tests
  testSession
    .post("/api/v1/auth/register")
    .send({
      name: "Customer 01",
      email: "jsmith@gmail.com",
      password: "password123",
    })
    .end(done);
});

describe("Authentication Routes", () => {
  test("Identifies existing registered email", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "John Smith",
        email: "jsmith@gmail.com",
        password: "12345678",
      })
      .expect(409, "User Already Exists. Please Login")
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
