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
    let orderAttr = ["collected", "items", "totalPrice", "createdAt"];

    const startIndex = (page - 1) * amount;
    const endIndex = page * amount;

    const query = {};

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
      default:
        queryFilter = {};
    }

    if (endIndex < (await model.countDocuments(queryFilter))) {
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

    query.totalPages = Math.ceil(
      (await model.countDocuments(queryFilter)) / amount
    );

    try {
      if (model === ItemModel) {
        query.results = await model
          // Displays only available items
          .find({ sold: false }, itemAttr)
          .limit(amount)
          .skip(startIndex)
          .sort(querySort);
      } else if (model === OrderModel && req.session.user.role !== "customer") {
        query.results = await model
          .find(queryFilter, [...orderAttr, "user"])
          .limit(amount)
          .skip(startIndex)
          .sort(querySort)
          .populate("user", "name")
          .populate("items", itemAttr);
      } else if (model === OrderModel && req.session.user.role === "customer") {
        query.results = await model
          .find({ ...queryFilter, user: req.session.user._id }, orderAttr)
          .limit(amount)
          .skip(startIndex)
          .sort(querySort)
          .populate("items", itemAttr);
      }
      res.paginatedResults = query;
      next();
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  };
};

module.exports = paginatedResults;
