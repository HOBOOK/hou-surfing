const Event = require('../models/event');
const RobotService = require('../services/robot.service');
const testSerialNo = 'R2023185WE12'
const socket = require('../app-socket.js')

exports.createAlarm = async (req, res, next) => {
  try {
    const event = {
        eventType: 'ALARM',
        message: {
            robot:{
                serialNo: testSerialNo,
                name: 'abb_irb6700_235_265',
            },
            code: 'ERR_01',
            level: 1,
            description: '축이 벗어남',
            checked:false,
            creationTime: Date.now(),
        },
        creationTime: Date.now(),
        tags:{
            serialNo: testSerialNo
        }
    }

    const savedEvent = new Event(event)
    savedEvent.save();

    RobotService.createAlarmEvent(savedEvent)

    socket.emit('event', savedEvent)
    res.status(201).json(true);
  } catch (err) {
    console.error(err);
    next(err)
  }
};