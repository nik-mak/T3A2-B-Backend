const express = require("express");
const router = express.Router();
const ItemModel = require("../models/item");

const pagination = require("../middleware/pagination");

// Display full catalogue of available items on the home page
router.get("/", async (req, res) => {
    try {
    res.send(await ItemModel.find({ sold: false }));
  } catch (err) {
    res.status(502).send({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  console.log(req);
  try {
    res.send(await ItemModel.find());
  } catch (err) {
    res.status(502).send({ error: err.message });
  }
});


module.exports = router;