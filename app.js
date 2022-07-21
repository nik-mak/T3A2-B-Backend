const express = require("express");
const cors = require("cors");

const apV1Routes = require("./routes");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://www.desperate-housewares.com/api/v1",
    credentials: true,
  })
);

app.use("/api/v1", apV1Routes);

app.get("/", (request, response) => response.send({ info: "Catalogue API" }));

module.exports = app;
