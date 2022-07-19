const ItemModel = require("../models/item")

// changes item's "sold" attribute value to true
const itemSold = async (items) => {
    await ItemModel.updateMany({ _id: { $in: items } }, { sold: true });
}

module.exports = itemSold;