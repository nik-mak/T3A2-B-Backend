const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors")

const app = express();

app.use(cors())

app.use(express.json());

app.get("/", (request, response) => response.send({ info: "Catalogue API" }));



module.exports = app;