const mongoose = require('../db/connection')
const { Schema } = mongoose

const UserModel = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "customer",
    },
    cart: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
  })
);

module.exports = UserModel;
