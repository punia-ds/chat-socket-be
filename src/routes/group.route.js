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

  router.post("/single", async (req, res) => {
    try {
      const { slug } = req.body;
      if (!slug) return sendRes(res, 400, "Please Add Slug");
      let group = await GroupSchema.findOne({ slug }).populate({
        path: "creator members admins",
        model: "User",
        select: "name email username",
      });
      if (group) return sendRes(res, 200, group);
      return sendRes(res, 400, "Something Wrong");
    } catch (error) {
      sendRes(res, 500, error.message);
    }
  });

  router.patch("/add-user", async (req, res) => {
    try {
      const { slug, members } = req.body;
      if (!slug || members.length == 0) return sendRes(res, 400, "Please Info");

      let group = await GroupSchema.findOneAndUpdate(
        { slug },
        { $push: { members } }
      );

      if (group) {
        io.emit("group-user", group);
        return sendRes(res, 200, "Members Added");
      }
      return sendRes(res, 400, "Something Wrong");
    } catch (error) {
      sendRes(res, 500, error.message);
    }
  });
  router.patch("/make-admin", async (req, res) => {
    try {
      const { slug, admin } = req.body;
      if (!slug || !admin) return sendRes(res, 400, "Please Info");

      let group = await GroupSchema.findOneAndUpdate(
        { slug },
        { $push: { admins: admin } }
      );

      if (group) {
        io.emit("admin-added", group);
        return sendRes(res, 200, "New Admin Added");
      }
      return sendRes(res, 400, "Something Wrong");
    } catch (error) {
      sendRes(res, 500, error.message);
    }
  });
  router.patch("/remove-admin", async (req, res) => {
    try {
      const { slug, admin } = req.body;
      if (!slug || !admin) return sendRes(res, 400, "Please Info");

      let group = await GroupSchema.findOneAndUpdate(
        { slug },
        { $pop: { admins: admin } }
      );

      if (group) return sendRes(res, 200, "Admin Removed");
      return sendRes(res, 400, "Something Wrong");
    } catch (error) {
      sendRes(res, 500, error.message);
    }
  });
  router.patch("/remove-user", async (req, res) => {
    try {
      const { slug, user } = req.body;
      if (!slug || !user) return sendRes(res, 400, "Please Info");

      let group = await GroupSchema.findOneAndUpdate(
        { slug },
        { $pop: { members: user } }
      );

      if (group) return sendRes(res, 200, "User Removed");
      return sendRes(res, 400, "Something Wrong");
    } catch (error) {
      sendRes(res, 500, error.message);
    }
  });

  return router;
};
