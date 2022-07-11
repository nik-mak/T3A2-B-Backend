const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");

// Get current admin details
router.get("/", async (req, res) => {
  res.status(200).send(await UserModel.findById(req.session.user._id));
});

// Get all users
router.get("/all", async (req, res) => {
  try {
    res.status(200).send(await UserModel.find());
  } catch (error) {
    res.status(401).send("You don't have access!");
  }
});

// Change a users role
router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send("Couldn't update user role");
  }
});

module.exports = router;
