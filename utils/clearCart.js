const UserModel = require("../models/user");

// removes all items from user's cart
const clearCart = async (user, items) => {
    await UserModel.updateOne(user, { $pullAll: { cart: items } });
}

module.exports = clearCart;