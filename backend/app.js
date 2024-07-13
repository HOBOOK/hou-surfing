require('dotenv').config();
require("./db/mongoose");
require('./error/error.js')
const healthCheckJob = require('./jobs/robot.healthcheck.job')
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const socket = require('./app-socket.js')

const indexRouter = require('./routes/index');
const modelsRouter = require('./routes/models');
const factoriesRouter = require('./routes/factories');
const eventsRouter = require('./routes/events');
const robotsRouter = require('./routes/robots');
const bomsRouter = require('./routes/boms');
const partsRouter = require('./routes/parts');
const tasksRouter = require('./routes/tasks');
const testRouter = require('./routes/test');
const pushRouter = require('./routes/push');
const recordRouter = require('./routes/records');
const resourcesRouter = require('./routes/resources');
const trajectoryRouter = require('./routes/trajectories');
const blackboxRouter = require('./routes/blackboxes');
const cctvRouter = require('./routes/cctvs');
const publicRouter = require('./routes/public');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/v1/models', modelsRouter);
app.use('/v1/factories', factoriesRouter);
app.use('/v1/events', eventsRouter);
app.use('/v1/robots', robotsRouter);
app.use('/v1/boms', bomsRouter);
app.use('/v1/parts', partsRouter);
app.use('/v1/tasks', tasksRouter);
app.use('/v1/test', testRouter);
app.use('/v1/push', pushRouter);
app.use('/v1/records', recordRouter);
app.use('/v1/trajectories', trajectoryRouter);
app.use('/v1/cctvs', cctvRouter);
app.use('/v1/blackboxes', blackboxRouter);
app.use('/resources', resourcesRouter);
app.use('/public', publicRouter);

app.io = socket

const socketRouter = express.Router();
socketRouter.get('/', (req, res, next) => {
  res.status(200).json()
})
socketRouter.post('/', (req, res, next) => {
  const {topic, message} = req.body
  if(topic && message) {
    socket.emit(topic, message)
    res.status(200).json()
  } else {
    res.status(400).json()
  }
})
app.use('/v1/sockets', socketRouter)

healthCheckJob.start(socket)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  res.status(errorcode.c001.status).json(errorcode.c001)
});



module.exports = app;
