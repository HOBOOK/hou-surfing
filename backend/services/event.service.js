const Event = require('../models/event');

// 이벤트 저장
exports.create = async (metadata, callback) => {
    try{
        let savedEventData = await Event.create({
            timestamp: Date.now(),
            metadata: metadata
        })

        if(callback && typeof callback === 'function' ) {
            callback(savedEventData)
        }
    }
    catch(err){
        console.error('event.service error: ', err)
    }
}

exports.getValue = (dataArray, name) => {
    for(let data of dataArray) {
        if(data.name === name) {
            return data.value
        }
    }
    return ''
}