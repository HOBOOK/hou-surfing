const Event = require('../models/event');
const commonUtils = require('../utils/commonUtils')
 
exports.create = async (req, res, next) => {
  try {
    const newEvent = new Event(req.body)
    newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.update = async (req, res, next) => {
  try {
    await Event
    .findOne({
      _id: req.body._id
    })
    .then((result) => {
      if(result){
        result.checked = req.body.checked
        result.save()
        res.status(200).json(result)
      }else {
          res.status(400).json({
              message:'잘못된 요청',
              code:'',
          })
      }
    })
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.read = async (req, res, next) => {
  try {

    let {start, end, metadata, limit} = req.query

    start = start ? parseInt(start, 10) : Date.now() - (24 * 60 * 60 * 1000);
    end = end ? parseInt(end, 10) : Date.now();
    if (end - start > 365 * 24 * 60 * 60 * 1000) {
      return res.status(400).send('시간 범위가 넓습니다. 1년 이내만 가능합니다');
    }
    limit = limit ? limit : 1000

    let query = {}

    if(metadata) {
      try{
        let queryObject = commonUtils.convertToDotNotation(JSON.parse(metadata))
        query = queryObject
      }
      catch (err){
        console.log(err)
      }
    }
    query.timestamp = { $gte: new Date(start), $lte: new Date(end) }

    await Event
    .find(query)
    .limit(limit)
    .then((result) => {
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
};