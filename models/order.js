const mongoose = require("../db/connection");
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    collected: { type: Boolean, default: false },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    totalPrice: Number,
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
