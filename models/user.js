const mongoose = require("../db/connection");
const { Schema } = mongoose;
const validateEmail = require("../utils/validate-email");

const UserModel = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: [
        true,
        "Failed to create/update User: Name of user is required.",
      ],
      minlength: [
        3,
        "Failed to create/update User: Minimum length for user's name is 3 characters.",
      ],
    },
    email: {
      type: String,
      required: [true, "Failed to create/update User: Email is required."],
      unique: true,
      trim: true,
      validate: {
        validator: validateEmail,
        message: "Failed to create/update User: Email format is not valid.",
      },
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email format is not valid.",
      ],
    },
    password: {
      type: String,
      required: [true, "Failed to create/update User: Password is required."],
      minlength: [
        8,
        "Failed to create/update User: Minimum length for password is 8 characters.",
      ],
    },
    role: {
      type: String,
      default: "customer",
    },
    cart: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  })
);

module.exports = UserModel;