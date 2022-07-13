const express = require("express");
const router = express.Router();
const ItemModel = require("../models/item");

const pagination = require("../middleware/pagination");

// Display full catalogue of available items on the home page
router.post("/", pagination(ItemModel),(req, res) => {
  try {
    res.send(res.paginatedResults);
  } catch (err) {
    res.status(502).send({ error: err.message });
  }
});


module.exports = router;