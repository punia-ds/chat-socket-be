const express = require("express");
const GroupSchema = require("../models/group.model");
const sendRes = require("../utils/response");

module.exports = (io) => {
  const router = express.Router();

  // Register a new user
  router.post("/create", async (req, res) => {
    try {
      const { groupName, creator } = req.body;
      if (!groupName || !creator) {
        return sendRes(res, 400, "All fields are required");
      }
      let slug;

      if (!req.body.slug) {
        slug = Math.floor(Math.random() * 100000000 + 1);
      } else {
        slug = req.body.slug;
      }

      let resp = await new GroupSchema({
        groupName,
        slug,
        creator,
        members: creator,
        admins: creator,
      }).save();

      if (resp) return sendRes(res, 200, "Created");
      io.emit("create-group", resp);
      return sendRes(res, 400, "Something Wrong");
    } catch (error) {
      sendRes(res, 500, error.message);
    }
  });

  router.get("/all", async (req, res) => {
    try {
      let groups = await GroupSchema.find().populate({
        path: "creator members admins",
        model: "User",
        select: "name email username",
      });
      if (groups.length > 0) return sendRes(res, 200, groups);
      return sendRes(res, 400, "Something Wrong");
    } catch (error) {
      sendRes(res, 500, error.message);
    }
  });

  return router;
};
