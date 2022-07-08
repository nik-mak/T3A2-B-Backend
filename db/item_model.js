const mongoose = require("./connection")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    size: String,
    image: {
        type: String,
        required: true
    },
    sold: Boolean
})

const ItemModel = mongoose.model("Item", itemSchema)

module.exports = ItemModel