const mongoose = require('mongoose');

// 시계열 데이터 스키마 정의
const eventSchema = new mongoose.Schema({
  timestamp: Date,
  metadata: Object,
}, { timestamps: false }); 

// 시계열 컬렉션으로 생성
mongoose.connection.createCollection("events", {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "seconds"
  }
})
.then(() => {

})
.catch((err)=> {
  if (err.code === 48) { 
    console.log("Collection already exists");
  } else {
    console.error("Error creating collection:", err);
  }
});


module.exports = mongoose.model('Event', eventSchema, 'events');