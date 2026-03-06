const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true,},
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    users: [{ type: mongoose.Types.ObjectId, ref: "users" }]
  }, {
    timestamps: true,
  }
);

const Event = mongoose.model("event", eventSchema, "events");
module.exports = Event;
