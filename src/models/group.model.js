const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  slug: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  
  admins: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
