const app = require("../app");
const mongoose = require("mongoose");
const session = require("supertest-session");
const ItemModel = require("../models/item");

let testSession = null;
let authenticatedSession = null;

// Clearing the items in the DB to make sure it doesn't impact the tests
beforeAll((done) => {
  ItemModel.deleteMany({}, (err) => {
    if (err) return done(err);
    return done();
  });
});

beforeAll((done) => {
  testSession = session(app);
  // creating a mock user for the tests
  // Admin can only be created at the DB
  // So run test first to create an admin
  // then go in MongoDB change Admin user role from "customer" to "admin"
  // then run tests again
  testSession
    .post("/api/v1/auth/register")
    .send({
      name: "Admin user",
      email: "user01@gmail.com",
      password: "password123",
    })
    .end(done);

  testSession
    .post("/api/v1/auth/login")
    .send({ email: "user01@gmail.com", password: "password123" })
    .expect(200)
    .end((err) => {
      if (err) return done(err);
      authenticatedSession = testSession;
      return done();
    });
});

afterAll(() => mongoose.connection.close());

// db calls can be slow so setting a higher timeout
jest.setTimeout(10000);

describe("Items routes", () => {
  test("Raise error if cannot find individual item from the catalogue", (done) => {
    authenticatedSession
      .get("/api/v1/items/1234567")
      .expect(404, "Enable to find item with id 1234567")
      .expect("Content-Type", /text/)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
  test("Add new item to catalogue with image uploaded to Cloudinary", (done) => {
    authenticatedSession
      .post("/api/v1/items/add")
      .set("Content-Type", "multipart/form-data")
      .field("name", "Blue t-shirt")
      .field("price", 14)
      .attach("image", "./tests/assets/no-img.png")
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        ItemModel.findOne({ name: "Blue t-shirt" }, (err, newItem) => {
          expect(newItem.price).toEqual(14);
          expect(newItem.name).toEqual("Blue t-shirt");
        });
        return done();
      });
  });
  test("Throw error if image is not uploaded for a new item", (done) => {
    authenticatedSession
      .post("/api/v1/items/add")
      .set("Content-Type", "multipart/form-data")
      .field("name", "Just another t-shirt")
      .field("price", 15)
      .expect(400, "Image not uploaded successfully!")
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
  test("Update an item", (done) => {
    ItemModel.findOne({ name: "Blue t-shirt" }, (err, item) => {
      authenticatedSession
        .put("/api/v1/items/" + item._id)
        .set("Content-Type", "multipart/form-data")
        .field("price", 20)
        .field("sold", true)
        .end(function (err, res) {
          if (err) return done(err);
          ItemModel.findOne({ name: "Blue t-shirt" }, (err, updatedItem) => {
            expect(updatedItem.price).toBe(20);
            expect(updatedItem.sold).toEqual(true);
          });
          expect(res.status).toBe(201);
          return done();
        });
    });
  });
  test("Delete an item", (done) => {
    ItemModel.findOne({ name: "Blue t-shirt" }, (err, item) => {
      authenticatedSession
        .delete("/api/v1/items/" + item._id)
        .end(function (err, res) {
          if (err) return done(err);
          ItemModel.findOne({ name: "Blue t-shirt" }, (err, deletedItem) => {
            expect(deletedItem).toBeFalsy();
          });
          expect(res.status).toBe(204);
          return done();
        });
    });
  });
});
