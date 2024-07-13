const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vectorSchema = new Schema({
  x: Number,
  y: Number,
  z: Number
})

const jointStateSchema = new Schema({
  name: String,
  axis: vectorSchema,
  velocity: Number,
  upper: Number,
  lower: Number,
  type: String,
  scalar: Number,
  id: Number,
})

const stateSchema = new Schema({
  jointStates: [jointStateSchema],
  effector: String,
  effectorMatrix: [Number]
})



const trajectorySchema = new Schema(
  {
    robotId: String,
    states: [stateSchema]
  },
  { versionKey: "_v",
    timestamps: true
  },
  { toJSON: { virtuals: true} }
);


module.exports = mongoose.model("trajectory", trajectorySchema);