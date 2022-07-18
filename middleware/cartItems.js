const UserModel = require("../models/user");

const populatedCart = async (req, res, next) => {
    const result = {};
    try {
      result.user = await UserModel.findById(req.session.user._id).populate(
        "cart"
      );
      result.items = result.user.cart;
      
      result.totalPrice = 0;
      result.items.forEach((item) => (result.totalPrice += item.price));
      res.populatedCart = result;
      console.log(result);
      next();
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
};

module.exports = populatedCart;