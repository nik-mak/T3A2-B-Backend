const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const OrderModel = require("../models/order");
const ItemModel = require("../models/item");

// Create new order from cart
router.post("/", async (req, res) => {
  // Customer access only
  if (req.session.user.role === "customer") {
    try {
      const user = await UserModel.findById(req.session.user._id);
      const items = user.cart;
      // Create new order with all items currently in user's cart
      await OrderModel.create({
        user: user._id,
        items: items,
      });
      // Remove items from user's cart
      await UserModel.updateOne(user, { $pullAll: { cart: items } });
      // Change items' status to sold
      await ItemModel.updateMany({ _id: { $in: items } }, { sold: true });
      res.status(201).send("Order created!");
    } catch {
      res.status(400).send({ error: err.message });
    }
  }
});

// Display all orders from the logged-in user
router.get("/", async (req, res) => {
  // Customer access only
  if (req.session.user.role === "customer") {
    try {
      const orders = await OrderModel.find(
        { user: req.session.user._id },
        { collected: 1, items: 1 }
      ).populate("items", ["name", "price", "size", "image"]);
      res.send(orders);
    } catch {
      res.status(400).send({ error: err.message });
    }
  }
});

// Defining that following routes are only authorised
// to staff and admin users
router.use((req, res, next) => {
  req.session.user.role === "customer"
    ? res.status(401).send({ error: "You don't have access!" })
    : next();
});

// Update order as collected
router.patch("/:id", async (req, res) => {
  try {
    await OrderModel.findByIdAndUpdate(req.params.id, { collected: true });
  } catch {
    res.status(400).send({ error: err.message });
  }
});

// Display all orders
router.get("/store", async (req, res) => {
  try {
    const orders = await OrderModel.find(
      {},
      { collected: 1, items: 1, user: 1 }
    ).populate("items", ["name", "price", "size", "image"]);
    res.send(orders);
  } catch {
    res.status(400).send({ error: err.message });
  }
});
// Display all orders not collected (including user's name)

// Display all order by date
// TODO - Sorting and pagination

module.exports = router;
