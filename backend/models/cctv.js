const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cctvSchema = new Schema(
  {
    name: String,
    group: String,
    url: String,
    tags:Object,
    metadata:Object,
  },
  {
    versionKey: "_v",
    timestamps: true,
  }
);

module.exports = mongoose.model("cctv", cctvSchema);
 