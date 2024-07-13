const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema(
  {
    part: { type: Schema.Types.ObjectId, ref: "part" }, 
    matrix: Array,
  },
  {
    _id: false,
  }
);

const bomSchema = new Schema(
  {
    serialNo: String,
    name: String,
    cadFileUrl: String,
    matrix: Array,
    parts: [partSchema],
    metadata: Object,
    tags: Object,
  },
  {
    versionKey: "_v",
    timestamps: true,
  }
);

module.exports = mongoose.model("bom", bomSchema);
