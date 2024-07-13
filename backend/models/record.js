const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordDataSchema = new Schema(
  {
    order: Number,
    name: String,
    data: Object,
    recordTime: Number,
  }
);

const recordSchema = new Schema({
    name: String,
    size: Number,
    record: [recordDataSchema],
    startTime: Number,
    endTime: Number,
    lengthOfTime: Number 
  }, { versionKey: "_v",
  timestamps: true }
)


module.exports = mongoose.model("record", recordSchema);