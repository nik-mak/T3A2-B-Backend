const UserModel = require("../models/user");
const clearCart = require("../utils/clearCart");

const populatedCart = async (req, res, next) => {
  const result = {};
  try {
    result.user = await UserModel.findById(req.session.user._id).populate(
      "cart"
    );
    // verifying if there are items in the cart no longer available
    // and removing those items from the cart
    const itemsNotAvailable = result.user.cart.filter((el) => el.sold === true);
    if (itemsNotAvailable.length > 0) {
      clearCart(result.user, itemsNotAvailable);
      throw "1 or more items in your cart is no longer available. Cart has been updated!";
    }
    // ensuring list of items has available items only
    result.items = result.user.cart.filter((el) => el.sold === false);
    // calculating order's total price
    result.totalPrice = 0;
    if (result.items.length > 0) {
      result.items.forEach((item) => (result.totalPrice += item.price));
      res.populatedCart = result;
    } else {
      throw "Your cart is empty!";
    }
    next();
  } catch (error) {
    res.status(400).send({ error });
  }
};

module.exports = populatedCart;
