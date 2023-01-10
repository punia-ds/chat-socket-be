const mongoose = require("mongoose");

const errorSchema = new mongoose.Schema(
  {
    message: String,
    code: Number,
    route: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("error", errorSchema);
