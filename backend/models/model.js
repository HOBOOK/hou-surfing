const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionSchema = new Schema({
  x:  {type: Number, default :0.0},
  y: {type: Number, default :0.0},
  z: {type: Number, default :0.0},
});

const rotationSchema = new Schema({
  isEuler: Boolean,
  _order: {type: String, default : 'XYZ'},
  _x:  {type: Number, default :0.0},
  _y: {type: Number, default :0.0},
  _z: {type: Number, default :0.0},
});

const modelSchema = new Schema(
  {
    name: String,
    url: String,
    textureUrl: String,
    createdBy: String,
    group: String,
    factory: {_id:mongoose.Schema.Types.ObjectId, name:String},
    type: {type:String, enum: ["unknown", "object", "robot", "map"], default: "unknown"},
    position: positionSchema,
    rotation: rotationSchema,
    scale: positionSchema,
    createdDate: { type: Date, default: Date.now },
    parent: Object,
    children: [Object],
  },
  { versionKey: "_v",
  timestamps: true }
);

module.exports = mongoose.model("model", modelSchema);