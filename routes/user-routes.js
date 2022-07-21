const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const UserModel = require("../models/user");

// Return current user
router.get("/:id", async (req, res) => {
  try {
    res.status(200).send(await UserModel.findById(req.session.user._id));
  } catch (error) {
    res.status(404).send("Cannot find user");
  }
});

// Edit user account
router.patch("/:id", async (req, res) => {
  if (req.session.user._id == req.params.id) {
    const { name, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { name: name, email: email, password: encryptedPassword },
      { new: true }
    );
    res.status(200).send(updatedUser);
  } else {
    res.status(400).send("Couldn't update user");
  }
});

// is logged in?
router.get("/loggedin", async(req, res) => {
  if (req.session.user) {
    const { _id, name, email, role } = req.session
    return res.status(200).json({
      id: _id,
      name: name,
      email: email,
      role: role
    })
    
  } else {
    return res.status(401).send("Not Logged In")
  }
})

module.exports = router
