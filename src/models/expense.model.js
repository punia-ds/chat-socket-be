const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    // category: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Category",
    // },
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("expense", expenseSchema);
