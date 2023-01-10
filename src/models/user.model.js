const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    about: String,
    picture: String,
    verified: {
      type: Boolean,
      default: false,
    },
    tick: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      default: "client",
    },
    status: {
      type: String,
      default: "active",
    },
    following: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
        },
      },
    ],
    followed: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash the password before saving the user to the database
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, result) => {
    if (error) {
      return callback(error);
    }
    callback(null, result);
  });
};

module.exports = mongoose.model("User", userSchema);
