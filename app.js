const express = require("express")
const cors = require('cors')

const apiV1AuthRoutes = require('./routes')
const itemsRouter = require("./routes/item_routes")

const app = express();

app.use(cors())

app.use('/api/v1', apiV1AuthRoutes)

app.get("/", (request, response) => response.send({ info: "Catalogue API" }));

app.use("/api/v1/items", itemsRouter)

module.exports = app;