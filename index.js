const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
require("dotenv").config();
const db = require("./src/config/db.config");
const expenseModel = require("./src/models/expense.model");
const io = require("socket.io")(server, {
  cors: {
    origins: "http://localhost:*",
  },
});

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// socket
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("A client has disconnected");
  });

  socket.on("add-expense", async (data) => {
    try {
      let insExp = new expenseModel({
        ...data,
        userId: "63bbc8591d5cd696a60744c9",
      });

      let add = await insExp.save();
      socket.emit("success", add);
    } catch (error) {
      console.log(error);
      socket.emit("error", () => error.message);
    }
  });
});
// routes

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/");
});
app.use("/api/v1/user/", require("./src/routes/user.route")(io));
app.use("/api/v1/group/", require("./src/routes/group.route")(io));

// server
const port = process.env.PORT || 3005;
server.listen(port, () => {
  console.log("Server listening on port " + port);
});
