const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const metadataSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "event" },
  robot: { type: Schema.Types.ObjectId, ref: "robot" },
})

const robotAlarmSchema = new Schema({
  metadata: metadataSchema,
  errorTarget: String,
  errorDomain: String,
  errorId: String,
  errorType: String,
  errorTitle: String,
  status: {type:String, enum: ['OPEN','PROCESSING', 'CLOSED']},
  etc: String,
  measure: String,
  checked: Boolean,
  closedTime: Number,
  editor: Object,
  timestamp:Date,
},
{ versionKey: "_v",
  timestamps: false
},
{ toJSON: { virtuals: true} })

// 시계열 컬렉션으로 생성
// mongoose.connection.createCollection("robotAlarms", {
//   timeseries: {
//     timeField: "timestamp",
//     metaField: "metadata",
//     granularity: "seconds"
//   }
// })
// .then(() => {

// })
// .catch((err)=> {
//   if (err.code === 48) { 
//     console.log("Collection already exists");
//   } else {
//     console.error("Error creating collection:", err);
//   }
// });


module.exports = mongoose.model("RobotAlarm", robotAlarmSchema, 'robotAlarms');