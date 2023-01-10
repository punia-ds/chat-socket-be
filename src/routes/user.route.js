const express = require("express");
const User = require("../models/user.model");
const sendRes = require("../utils/response");
const bcrypt = require("bcrypt");


module.exports = (io) => {
  const router = express.Router();

  // Register a new user
  router.post("/registration", (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return sendRes(res, 400, "All fields are required");
    }
    User.findOne({ email }, (error, user) => {
      if (error) {
        return sendRes(res, 500, error.message);
      }
      if (user) {
        return sendRes(res, 400, "User Already Exists");
      }
      const newUser = new User({ email, password, name });
      newUser.save((error, savedUser) => {
        if (error) {
          return sendRes(res, 500, error.message);
        }
        io.emit("user registered", savedUser);
        return sendRes(res, 200, "Registration Success");
      });
    });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendRes(res, 400, "All fields are required");
    }
    User.findOne({ email }, async (error, user) => {
      if (error) {
        return sendRes(res, 500, error.message);
      }
      if (!user) {
        return sendRes(res, 400, "User Not Exists");
      }

      let result = await bcrypt.compare(password, user.password);
      if (!result) {
        return sendRes(res, 400, "User Not Exists");
      }
      io.emit("user logged in", user);
      return sendRes(res, 200, user);
    });
  });

  return router;
};
