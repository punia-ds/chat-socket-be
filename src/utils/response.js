const errorModel = require("../models/error.model");

async function sendRes(res, status, message) {
  if (status != 200) {
    const errUrl =
      res.req.protocol + "://" + res.req.get("host") + res.req.originalUrl;
    let insErr = new errorModel({
      message,
      code: status,
      route: errUrl,
    });

    let ins = await insErr.save();
    return res.json({ status, message });
  } else {
    return res.json({ status, message });
  }
}

module.exports = sendRes;
