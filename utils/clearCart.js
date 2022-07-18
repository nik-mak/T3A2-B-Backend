const UserModel = require("../models/user");

const clearCart = async (user, items) => {
    await UserModel.updateOne(user, { $pullAll: { cart: items } });
}

module.exports = clearCart;