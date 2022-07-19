const mongoose = require("../db/connection");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name of the item is required."],
      minLength: [3, "Minimum length is 3."]
    },
    price: {
      type: Number,
      min: [1, "Minimum price is $1."],
      required: [true, "Price of the item is required."]
    },
    size: String,
    image: {
      type: String,
      required: [true, "Image of the item is required."],
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
