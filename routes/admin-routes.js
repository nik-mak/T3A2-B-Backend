const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

// Get all staff and admin accounts
router.get("/all/staff", async (req, res) => {
  try {
    const staff = await UserModel.find({ role: "staff" });
    const admin = await UserModel.find({ role: "admin" });
    res.status(200).send([...staff, ...admin]);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Admin creates account for new staff
router.post("/register/staff", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate user input
    if (!(name && email && password)) {
      return res.status(400).send("All input is required");
    }

    // Check if email is already in use
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await UserModel.create({
      name: name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role: "staff",
    });

    // Return new user info
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Admin removes/deletes a staff account
router.delete("/:id", async (req, res) => {
  try {
    // Find account info
    const user = await UserModel.findById(req.params.id);

    // Ensure account is a staff account
    if (!(user.role == "staff")) {
      res.status(401).send("Not a staff account");
    }

    // Delete account from database
    await UserModel.findByIdAndDelete(req.params.id);

    res.sendStatus(204);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
