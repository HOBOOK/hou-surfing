const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processSchema = new Schema({
  name: String,
  children: [Object],
});

const pipelineSchema = new Schema({
  name: { type: String, default: "None" },
  root: { type: Boolean, default: true },
  children: [processSchema],
});

const weldingVersionSchema = new Schema(
  {
    worker: String,
    data: Array,
    details: Array,
    actionType: { type: String, enum: ["CREATE", "EDIT", "DELETE"] },
  },
  { timestamps: true }
);

const weldingDataSchema = new Schema({
  latest: weldingVersionSchema,
  versions: [weldingVersionSchema],
});

const arrangementVersionSchema = new Schema(
  {
    worker: String,
    data: Object,
    actionType: { type: String, enum: ["CREATE", "EDIT"] },
  },
  { timestamps: true }
);

const arrangementSchema = new Schema({
  latest: arrangementVersionSchema,
  versions: [arrangementVersionSchema],
});

const taskSchema = new Schema(
  {
    bom: { type: Schema.Types.ObjectId, ref: "bom" },
    name: String,
    note: String,
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    checked: Boolean,
    arrangement: arrangementSchema,
    weldingData: weldingDataSchema,
    pipeline: pipelineSchema,
  },
  { versionKey: "_v", timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);
