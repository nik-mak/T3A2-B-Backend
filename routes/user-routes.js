const express = require("express")
const router = express.Router()
const UserModel = require("../models/user")

router.post("/welcome", (req, res) => {
  res.status(200).send("Welcome!")
})

router.get("/all", async (req, res) => {
  if (req.session.user.role == 'admin') {
    res.status(200).send(await UserModel.find())
  } else {
    res.status(401).send("You don't have access!")
  }
})

router.get("/:id", async (req, res) => {
  try {
    res.status(200).send(await UserModel.findById(req.session.user._id))
  } catch (error) {
    res.status(404).send({ error: 'Cannot find user' })
  }
})

module.exports = router