const mongoose = require("mongoose");
const config = require("config")

mongoose
  .connect(config.ATLAS_DB_URL)
  .then(() =>
    console.log(
      mongoose.connection.readyState == 1
        ? "Mongoose connected"
        : "Mongoose failed"
    )
  )
  .catch((err) => console.log(err));

module.exports = mongoose;