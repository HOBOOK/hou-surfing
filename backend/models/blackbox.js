const mongoose = require('mongoose');

const blackboxSchema = new mongoose.Schema({
  key: String,
  startTimestamp: Number,
  endTimestamp: Number,
  length: Number,
  lengthOfTime: Number,

}, { timestamps: false }); 


module.exports = mongoose.model('Blackbox', blackboxSchema, 'blackboxes');