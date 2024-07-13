const schedule = require('node-schedule')
const Robot = require('../models/robot.js')
const Event = require('../models/event.js')


const RobotService = require('../services/robot.service');



function start(socket) {
    if(!socket) return

    Robot.find({
        inactive: false
    })
    .then(result => {
        for(let i = 0; i < result.length; i++) {
            try{
                setInterval(async () => {
                    const prevHealthy = result[i].isHealthy

                    const query = {
                        timestamp: {
                            $gte: new Date(Date.now() - result[i].healthFailSecond * 1000),
                            $lte: new Date(Date.now())
                        },
                        'metadata.header.frame_id' : result[i].prefix
                    }

                    const exist = await Event.exists(query)

                    result[i].isHealthy = exist ? true : false

                    if(result[i].isHealthy) {
                        result[i].lastHealthTime = new Date(Date.now())
                    } 
                    console.log(result[i].serialNo, result[i].isHealthy)

                    result[i].save()

                    if(prevHealthy !== result[i].isHealthy) {
                        let msg = result[i].isHealthy ? '로봇이 다시 가동 되었습니다. ' : '로봇 가동이 중지되었습니다.'
                        RobotService.createAlarmEvent(result[i], ['1','1',1, msg], socket)
                    }

                    socket.emit('health', {
                        isHealthy: result[i].isHealthy,
                        prefix: result[i].prefix
                    })

                }, result[i].healthIntervalSecond * 1000)
            }catch(err) {
                console.log(err)
            }
            
        }
    })
}

module.exports = {
    start
}





