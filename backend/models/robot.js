const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const robotDescriptionSchema = new Schema({
  link: [Object],
  joint: [Object]
})

const robotSchema = new Schema(
  {
    serialNo: String,
    name: String,
    prefix: String,
    urdf: String,
    robotDescription: robotDescriptionSchema,
    image: String,
    createdDate: { type: Date, default: Date.now },
    tags: Object,
    healthIntervalSecond: {type: Number, default: 60},
    healthFailSecond:{type:  Number, default: 300},
    lastHealthTime: {type: Date},
    configuration: Object,
    inactive: {type: Boolean, default:false},
    authorized: {type: Boolean, default:false},
    effector: Object,
    isHealthy: {type: Boolean, default:false}
  },
  { versionKey: "_v",
    timestamps: true
  },
  { toJSON: { virtuals: true} }
);

// robotSchema.virtual('isHealthy').get(function() {
//   try{
//       const currentTimestamp = Date.now();
//       return this.lastHealthTime && ((this.lastHealthTime.getTime() + (this.healthFailSecond * 1000)) >= currentTimestamp);
//   }catch (error){
//       return false;
//   }
// })

robotSchema.virtual('isActionRequired').get(function() {
  try{
      return this.alarmEvents.filter(item => !item.closedTime).length > 0;
  }catch (error){
      return false;
  }
})

robotSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model("robot", robotSchema);