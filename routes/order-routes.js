const express = require("express");
const router = express.Router();

const OrderModel = require("../models/order");

const customerAuth = require("../middleware/customer-auth");
const storeAuth = require("../middleware/store-auth");
const pagination = require("../middleware/pagination");
const cartItems = require("../middleware/cart-items")

const clearCart = require("../utils/clear-cart")
const itemSold = require("../utils/item-sold")

// Create new order from cart
// Customer access only
router.post("/add", customerAuth, cartItems, async (req, res) => {
  try {
    // Destructuring response from cartItems middleware
    const { user, items, totalPrice } = res.populatedCart

    // Create new order with all items currently in user's cart
    await OrderModel.create({
      user: user._id,
      items: items,
      totalPrice: totalPrice,
    });

    // Remove order items from user's cart
    clearCart(user, items)

    // Change order items' status to sold
    itemSold(items)

    res.status(201).send("Order created successfully!");
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
