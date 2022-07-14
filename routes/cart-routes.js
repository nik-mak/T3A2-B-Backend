const express = require("express");
const router = express.Router();
const ItemModel = require("../models/item");
const UserModel = require("../models/user");

// Add items into user's cart (order not yet created)
router.put("/:id", async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    const user = await UserModel.findById(req.session.user._id)
    
    // Verify if item is already in the cart before adding it
    if (user.cart.includes(item._id)) {
      throw "Item is already in the cart!"
    } else {
      await UserModel.updateOne(user, { $push: { cart: item._id } })
    }
    res.status(201).send("Item added into cart!");
  } catch (error) {
    res.status(400).send({ error });
  }  
});

// Display all items inside user's cart
router.get("/", async (req, res) => {
  try {
    const user = await UserModel.findById(req.session.user._id).populate(
      "cart",
      ["name", "price", "size", "image"]
    );
    res.status(200).send(user.cart);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Remove specific item from user's cart
router.delete("/:id", async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    await UserModel.findByIdAndUpdate(req.session.user._id, {
      $pull: { cart: item._id },
    });
    res.status(200).send("Item removed from cart!");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Remove all items from user's cart
router.delete("/", async (req, res) => {
  try {
    const user = await UserModel.findById(req.session.user._id);
    const items = user.cart;
    await UserModel.updateOne(user, { $pullAll: { cart: items } });
    res.status(200).send("Your cart is now empty!");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
