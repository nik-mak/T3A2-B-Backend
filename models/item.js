const mongoose = require("../db/connection");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: String,
    image: {
      type: String,
      required: true,
      default: "N/A"
    },
    imageId: String,
    sold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ItemModel = mongoose.model("Item", itemSchema);

module.exports = ItemModel;
