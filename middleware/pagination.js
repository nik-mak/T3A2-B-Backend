const ItemModel = require("../models/item");
const OrderModel = require("../models/order");

const paginatedResults = (model) => {
  return async (req, res, next) => {
    // page requested by user
    const page = parseInt(req.body.page);
    // how many items/orders to be displayed per page
    const amount = parseInt(req.body.amount);
    // what type of sort has been requested
    const sort = req.body.sort;
    // what type of filter has been requested
    const filter = req.body.filter;

    let querySort = {};
    let queryFilter = {};
    const query = {};

    const itemAttr = ["name", "price", "size", "image"];
    let orderAttr = ["collected", "items", "totalPrice", "createdAt"];

    // defining parameters for .sort() based on the req.sort
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

    // defining parameters for .filter() based on the req.filter
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

    // identifying index of the first item on requested page (zero indexed)
    // determines how many items to skip when querying for a new page `.skip()`
    const startIndex = (page - 1) * amount;
    // defining index of the last item of the requested page
    const endIndex = page * amount;

    // identifying the total number of documents to be displayed
    // for the request received
    let numberOfDocs;
    // store members should see all orders but customers can only see theirs
    if (model === OrderModel && req.session.user.role === "customer") {
      numberOfDocs = await model.countDocuments({
        ...queryFilter,
        user: req.session.user._id,
      });
    } else {
      numberOfDocs = await model.countDocuments(queryFilter);
    }

    // defining the total number of pages for the query received
    query.totalPages = Math.ceil(numberOfDocs / amount);

    // defining which is the previous page for the requested page
    // only defined if user is not on the page 1
    if (startIndex > 0) {
      query.previous = {
        page: page - 1,
        amount: amount,
      };
    }

    // defining which is the next page for the requested page
    // only defined if user is not on the last page
    if (endIndex < numberOfDocs) {
      query.next = {
        page: page + 1,
        amount: amount,
      };
    }

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
      // response includes next page, previous page, total of pages and results of the db query
      res.paginatedResults = query;
      next();
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  };
};

module.exports = paginatedResults;
