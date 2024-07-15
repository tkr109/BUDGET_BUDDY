const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required and should be unique"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    budgets: {
      salary: { type: Number, default: 10000 },
      tip: { type: Number, default: 10000 },
      project: { type: Number, default: 10000 },
      food: { type: Number, default: 10000 },
      movie: { type: Number, default: 10000 },
      bills: { type: Number, default: 10000 },
      medical: { type: Number, default: 10000 },
      fee: { type: Number, default: 10000 },
      tax: { type: Number, default: 10000 },
    },
  },
  { timestamps: true }
);


const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
