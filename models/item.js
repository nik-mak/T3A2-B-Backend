const mongoose = require("../db/connection");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        "Failed to create/update Item: Name of the item is required.",
      ],
      minLength: [
        3,
        "Failed to create/update Item: Minimum length for item name is 3 characters.",
      ],
    },
    price: {
      type: Number,
      min: [1, "Failed to create/update Item: Minimum item price is $1."],
      required: [
        true,
        "Failed to create/update Item: Price of the item is required.",
      ],
    },
    size: String,
    image: {
      type: String,
      required: [
        true,
        "Failed to create/update Item: Image of the item is required.",
      ],
      default: "N/A",
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
