const ItemModel = require("../models/item")

const itemSold = async (items) => {
    await ItemModel.updateMany({ _id: { $in: items } }, { sold: true });
}

module.exports = itemSold;