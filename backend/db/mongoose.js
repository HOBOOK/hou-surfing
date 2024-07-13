const mongoose = require("mongoose");

console.log('mongodb 접속시도: ' + process.env.DB_URL)

const options = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  server: {
      socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 50000,
      }
  },
  replset: {
      socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 50000,
      }
  },
  autoReconnect: true, 
  // serverSelectionTimeoutMS: 5000,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 5000, 
  poolSize: 10,
};

const connectWithRetry = () => {
  mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
  }, options)
  .catch(err => {
    console.error('MongoDB Connection Error : ', err)
    setTimeout(connectWithRetry, 5000);
  })

  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error("MongoDB 연결 에러:", error);
  });

  db.once("open", () => {
    console.log("MongoDB 연결 성공");
  });
};

connectWithRetry()



