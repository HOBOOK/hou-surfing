
const EventService = require('./services/event.service');
const RobotService = require('./services/robot.service');


/**
 * WebSocket Socket.io
 */

var socket = require('socket.io')({
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});
  
let sockets = []
socket.on('connection', (socket) => {

    console.log('connected', socket.id)

    sockets.push(socket)

    socket.on('message', (msg) => {
        app.io.emit('message', msg)
    });

    socket.on('disconnect', () => {
        console.log('disconnected', socket.id)
        sockets = sockets.filter((e) => e.id !== socket.id)
    });

    socket.on('error', (error) => { //에러 시
        console.error('socket.io Error : ', error);
    });
})

module.exports = socket

/**
 * ROS roslib.js
 */

var parser = require('xml2json');
var ROSLIB = require('roslib')

const rosServerUrl = 'ws://121.145.25.203:9090/'
//const rosServerUrl = 'wss://rosws.vazil.me'

var ros = new ROSLIB.Ros({
    url : rosServerUrl
})

let reconnectInterval;
const reconnectIntervalTime = 5000

function connectRos() {
    ros.connect(rosServerUrl)
}

ros.on('connection', function() {
    console.log('[ROS] Connected to ros server.');
    if(reconnectInterval){
        clearInterval(reconnectInterval)
        reconnectInterval = null
    }
});

ros.on('error', function(error) {
    console.log('[ROS] Error connecting to ros server: ', error.message);
});

ros.on('close', function() {
    console.log('[ROS] Connection to ros server closed.');

    if(!reconnectInterval) {
        reconnectInterval = setInterval(connectRos, reconnectIntervalTime)
    }
});



// ROS Topic 구독
const rosTopics = ['robot_status', 'joint_states', 'robot_actuator', 'recognized_object_array']
let rosListeners = []

for(let topic of rosTopics) {
    const listener = new ROSLIB.Topic({
        ros: ros,
        name: '/' + topic
    })

    listener.subscribe((message) => {
        socket.emit(topic, message)

        EventService.create(message, (e) => {
            switch (topic) {
                case 'robot_status': 
                    let alarm = EventService.getValue(e.metadata?.rms_data_array, 'alarmMessage')
                    if(alarm) {
                        let alarmData = alarm.split(';')

                        if(alarmData.length === 4 && alarmData[2] > 1) {
                            RobotService.createROSAlarmEvent(e, alarmData, socket)
                        }
                    }
                    break
                
                case 'joint_status': 
                    break

                case 'robot_actuator':
                    break
                case 'recognized_object_array':
                    console.log(message)
                    break

                default: 
                    break
                
            }
            
        })
    })
    rosListeners.push(listener)
}


/**
 * 더미(가짜) 데이터 생성 테스트
 */


// 생산(작업) 정보
// let prodCount = 0;
// setInterval(() => {
//     const message = {
//         robot:{
//             serialNo: testSerialNo,
//         },
//         operationTime: (Date.now() - 1692337214000),
//         upTime:1692333614000,
//         prodCount: prodCount++,
//         defectCount: parseInt(prodCount / 10),
//     }

//     const header = {
//         stamp: {
//             sec: Date.now(),
//             nanosec: 529100200
//         },
//         frame_id: 'welding'
//     }

//     EventService.create({timestamp:Date.now(), metadata: {message, header}})
// }, 10000)


//알람 정보 테스트
// setInterval(() => {
//     console.log('알람 상황 테스트')

//     const message = {
//         header: {
//             stamp: {
//                 sec: Date.now(),
//                 nanosec: 529100200
//             },
//             frame_id: 'welding'
//         },
//         rms_data_array:[{
//                 name: 'isAutoMode',
//                 value: 'false'
//             }, {
//                 name: 'isMotorsOn',
//                 value: 'false'
//             }, {
//                 name: 'isRAPIDRunning',
//                 value: 'false'
//             }, {
//                 name: 'isMechainRunning',
//                 value: '0'
//             }, {
//                 name: 'isEmergencyStop',
//                 value: '0'
//             }, {
//                 name: 'isTempWarning',
//                 value: '0'
//             }, {
//                 name: 'alarmMessage',
//                 value: '1;12;2;"알람 테스트 입니다."'
//             }]
//     }

//     EventService.create(message, (e) => {
//         let alarm = EventService.getValue(e.metadata?.rms_data_array, 'alarmMessage')
//         if(alarm) {

//             let alarmData = alarm.split(';')

//             if(alarmData.length === 4 && alarmData[2] > 1) {
//                 RobotService.createROSAlarmEvent(e, alarmData, socket)
//             }

//         }
//     })

// }, 600000)




