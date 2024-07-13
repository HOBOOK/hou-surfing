const Robot = require('../models/robot');
const Event = require('../models/event');
const RobotAlarm = require('../models/robotAlarm');
const PushService = require('./push.service');



exports.create = async (robot) => {
    return new Promise((resolve, reject) => {
        try{
            Robot.findOne({ 
                serialNo: robot.serialNo
            })
            .then((res) => {
                if(!res){
                    const newRobot = new Robot(robot)
                    newRobot.save();
                    resolve(newRobot)
                }else{
                    reject({
                        message: '이미 존재하는 데이터',
                        data: null
                    })
                }
            })
            .catch( err => {
                reject(err)
            })
        }catch{
            reject({
                message: '알 수 없는 예외 발생',
                data: null
            })
        }
    });
}

exports.createAlarmEvent = (robot, alarmDataArray, socket) => {
    return new Promise(async (resolve, reject) => {
        try{
            let alaramData = {
                timestamp: Date.now(),
                metadata: {
                    robot: robot._id
                },
                errorTarget: robot.serialNo,
                errorDomain: alarmDataArray[0],
                errorId: alarmDataArray[1],
                errorType: alarmDataArray[2],
                errorTitle: alarmDataArray[3],
                status: 'OPEN'
            }
            let savedAlarm = await RobotAlarm.create(alaramData)
            PushService.send(PushService.parsingJsonMessage(alaramData))
            socket.emit('alarm', savedAlarm)
            resolve(savedAlarm)
            
        }catch(err){
            console.log(err)
            reject({
                message: '알 수 없는 예외 발생',
                data: null
            })
        }
    })
}

exports.createROSAlarmEvent = (event, alarmDataArray, socket) => {
    return new Promise(async (resolve, reject) => {
        try{
            let prefix = event.metadata.header.frame_id

            Robot.findOne({
                prefix: prefix
            })
            .then(async (robot) => {

                let alaramData = {
                    timestamp: Date.now(),
                    metadata: {
                        event: event._id.toString(),
                        robot: robot._id.toString()
                    },
                    errorTarget: robot.serialNo,
                    errorDomain: alarmDataArray[0],
                    errorId: alarmDataArray[1],
                    errorType: alarmDataArray[2],
                    errorTitle: alarmDataArray[3],
                    status: 'OPEN'
                }
                let savedAlarm = await RobotAlarm.create(alaramData)
                PushService.send(PushService.parsingJsonMessage(alaramData))
                socket.emit('alarm', savedAlarm)
                resolve(savedAlarm)
            })
            .catch(err=>{
                reject({
                    message: err,
                    data: null
                })
            })
        }catch(err){
            console.log(err)
            reject({
                message: '알 수 없는 예외 발생',
                data: null
            })
        }
    });
}

exports.readAlarmEvent = async (query) => {
    return new Promise((resolve, reject) => {
        try{
            const limit = query.limit ? parseInt(query.limit) : 1000
            if(query.limit) {
                delete(query.limit)
            }
            RobotAlarm.find(query)
            .sort('-timestamp')
            .limit(limit)
            .then((res) => {
               resolve(res)
            })
            .catch(err=>{
                console.log(err)
                reject({
                    message: '찾는 알림 없음',
                    data: null
                })
            })
        }catch{
            reject({
                message: '알 수 없는 예외 발생',
                data: null
            })
        }
    });
}

exports.closeAlarmEvent = async (alarm) => {
    return new Promise((resolve, reject) => {
        try{
            RobotAlarm.findOne({
                _id: alarm._id
            })
            .then((res) => {
                res.status = 'CLOSED'
                res.checked = true
                res.closedTime = parseInt(Date.now())
                res.measure = alarm.measure
                res.save()
                resolve(res)
            })
            .catch(err=>{
                reject({
                    message: '찾는 알림 없음',
                    data: null
                })
            })
        }catch{
            reject({
                message: '알 수 없는 예외 발생',
                data: null
            })
        }
    });
}