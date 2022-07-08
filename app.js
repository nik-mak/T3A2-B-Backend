const express = require("express")
const cors = require('cors')

const apiV1AuthRoutes = require('./routes')

const app = express();

app.use(cors())

app.use('/api/v1', apiV1AuthRoutes)

app.get("/", (request, response) => response.send({ info: "Catalogue API" }));

module.exports = app;