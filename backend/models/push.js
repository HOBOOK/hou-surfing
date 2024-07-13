const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pushSchema = new Schema(
  {
    title: String,
    description: String,
    webhookUrl: String,
  },
  { versionKey: "_v",
  timestamps: true }
);

module.exports = mongoose.model("push", pushSchema);