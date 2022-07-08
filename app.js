const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors")
const itemsRouter = require("./routes/item_routes")

const app = express();

app.use(cors())

app.use(express.json());

app.get("/", (request, response) => response.send({ info: "Catalogue API" }));

app.use("/api/v1/items", itemsRouter)

module.exports = app;