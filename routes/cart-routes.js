const express = require("express");
const router = express.Router();
const ItemModel = require("../models/item");
const UserModel = require("../models/user");

// Defining that all following routes are authorised to shoppers only
router.use((req, res, next) => {
  req.session.user.role === "customer"
    ? next()
    : res.status(401).send({ error: "You don't have access!" });
});

// Add items into user's cart (order not yet created)
router.put("/:id", async (req, res) => {
  const item = await ItemModel.findById(req.params.id);
  await UserModel.findByIdAndUpdate(req.session.user._id, {
    $push: { cart: item._id },
  });
  res.status(201).send("Item added into cart!");
});

// Display all items inside user's cart
router.get("/", async (req, res) => {
  const user = await UserModel.findById(req.session.user._id).populate("cart", [
    "_id",
    "name",
    "price",
    "image",
  ]);
  res.status(200).send(user.cart);
});

// Remove specific item from user's cart
router.delete("/:id", async (req, res) => {
  const item = await ItemModel.findById(req.params.id);
  await UserModel.findByIdAndUpdate(req.session.user._id, {
    $pull: { cart: item._id },
  });
  res.status(200).send("Item removed from cart!");
});

// Remove all items from user's cart
router.delete("/", async (req, res) => {
  const user = await UserModel.findById(req.session.user._id);
  const items = user.cart;
  await UserModel.updateOne(user, { $pullAll: { cart: items } });
  res.status(200).send("Your cart is now empty!");
});

module.exports = router;
