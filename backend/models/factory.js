const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const robotSchema = new Schema({
  robotId: String,
  matrix: [Number],
  matrixWorld: [Number],
  unselectable: Boolean
}, {
  timestamps: true 
})

const assetSchema = new Schema({
  url: String,
  name: String,
  matrix: [Number],
  matrixWorld: [Number],
  unselectable: Boolean
})

const groupSchema = new Schema({
  name: String,
  tags: Object,
  assets:[assetSchema],
}, {
  timestamps: true 
})

const objectSchema = new Schema({
  name: String,
  type: String,
  url: String,
  matrix: [Number],
  matrixWorld: [Number],
  unselectable: Boolean,
  visible: Boolean,
  toggleActive: Boolean,
  metadata: Object
}, {
  timestamps: true 
})

objectSchema.add({children: [objectSchema]})

const factorySchema = new Schema(
  {
    name: String,
    createdBy: String,
    goals: { type: Number, default: 0},
    children:[objectSchema],
    groups:[groupSchema],
    robots:[robotSchema],
    structures:[objectSchema],
    tags: Object,
    public: Boolean
  },
  { versionKey: "_v",
  timestamps: true }
);

module.exports = mongoose.model("factory", factorySchema);