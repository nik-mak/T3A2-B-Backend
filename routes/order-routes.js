const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const OrderModel = require("../models/order");
const ItemModel = require("../models/item");

const customerAuth = require("../middleware/customer-auth");
const storeAuth = require("../middleware/store-auth");
const pagination = require("../middleware/pagination");

// Create new order from cart
// Customer access only
router.post("/add", customerAuth, async (req, res) => {
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
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Display all orders from the logged-in user
// Customer access only
// Sends response with the pagination, sorting and filter
router.post("/", customerAuth, pagination(OrderModel), async (req, res) => {
  try {
    res.send(res.paginatedResults);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Defining that following routes are only authorised
// to staff and admin users
router.use(storeAuth);

// Mark order as collected
router.patch("/:id", async (req, res) => {
  try {
    await OrderModel.findByIdAndUpdate(req.params.id, { collected: true });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Display all orders with pagination, sorting and filter
router.post("/store", pagination(OrderModel), async (req, res) => {
  try {
    res.send(res.paginatedResults);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
