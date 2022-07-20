const mongoose = require("../db/connection");
const { Schema } = mongoose;
const validateEmail = require("../utils/validate-email");

const UserModel = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: [true, "User name is required."],
      minlength: [3, "Minimum length is 3."],
    },
    email: {
      type: String,
      required: [true, "User email is required."],
      unique: true,
      trim: true,
      validate: [validateEmail, "Email format is not valid."],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email format is not valid.",
      ],
    },
    password: {
      type: String,
      required: [true, "User password is required."],
      minlength: [8, "Password minimum length is 8."],
    },
    role: {
      type: String,
      default: "customer",
    },
    cart: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  })
);

module.exports = UserModel;
