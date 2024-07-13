const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema(
  {
    serialNo: String,
    name: String,
    cadFileUrl: String,
  },
  {
    versionKey: "_v",
    timestamps: true,
  }
);

module.exports = mongoose.model("part", partSchema);
 