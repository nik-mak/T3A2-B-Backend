const ItemModel = require("../models/item");
const OrderModel = require("../models/order");

const paginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.body.page);
    const amount = parseInt(req.body.amount);
    const sort = req.body.sort;
    const filter = req.body.filter;
    let querySort = {};
    let queryFilter = {};
    const itemAttr = ["name", "price", "size", "image"];

    const startIndex = (page - 1) * amount;
    const endIndex = page * amount;

    const query = {};

    if (endIndex < (await model.countDocuments())) {
      query.next = {
        page: page + 1,
        amount: amount,
      };
    }

    if (startIndex > 0) {
      query.previous = {
        page: page - 1,
        amount: amount,
      };
    }

    switch (sort) {
      case "recent":
        querySort = { _id: -1 };
        break;
      case "price(high - low)":
        querySort = { price: -1 };
        break;
      case "price(low - high)":
        querySort = { price: 1 };
        break;
      default:
        querySort = { _id: -1 };
    }

    switch (filter) {
      case "collected":
        queryFilter = { collected: true };
        break;
      case "pending":
        queryFilter = { collected: false };
        break;
      case "available":
        queryFilter = { sold: false };
        break;
      default:
        queryFilter = {};
    }

    try {
      if (model === ItemModel) {
        query.results = await model
          .find(queryFilter, itemAttr)
          .limit(amount)
          .skip(startIndex)
          .sort(querySort);
      } else if (model === OrderModel && req.session.user.role !== "customer") {
        query.results = await model
          .find(queryFilter, ["collected", "items", "user"])
          .populate("items", itemAttr)
          .populate("user", "name")
          .limit(amount)
          .skip(startIndex)
          .sort(querySort);
      } else if (model === OrderModel && req.session.user.role === "customer") {
        query.results = await model
          .find({ ...queryFilter, user: req.session.user._id }, [
            "collected",
            "items",
          ])
          .populate("items", itemAttr)
          .limit(amount)
          .skip(startIndex)
          .sort(querySort);
      }
      res.paginatedResults = query;
      next();
    } catch (err) {
      res.status(400).send({ error: error.message });
    }
  };
};

module.exports = paginatedResults;
