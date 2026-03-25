const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: {type: String, enum: ["user", "admin"], default: "user"},
    image: { type: String, required: true },
    events: [{ type: mongoose.Types.ObjectId, ref: "event" }]
  }, {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("users", userSchema, "users");
module.exports = User;
