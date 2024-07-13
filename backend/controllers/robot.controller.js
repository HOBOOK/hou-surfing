const Robot = require('../models/robot');
const RobotService = require('../services/robot.service');

exports.create = async (req, res, next) => {
  try {
    await RobotService.create(req.body)
    .then(r=>{
      res.status(201).json(r);
    })
    .catch(err=>{
      console.error(err);
      next(err);
    })
    
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
    try {
        await Robot.findOne({
          _id: req.body._id
        })
        .then((result)=>{
            if(result){
              for(let k of Object.keys(req.body)) {
                if(k === '_id' || k === '_v' || result[k] === req.body[k] || !req.body[k])
                  continue
                if(Array.isArray(req.body[k]) && req.body[k].length === 0) {
                  continue
                }
                result[k] = req.body[k]
              }
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
    await Robot
    .find(req.query)
    .then((result) => {
   
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
};




exports.readAlarmEvent = async (req, res, next) => {
  try{

    RobotService.readAlarmEvent(req.query)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(err=>{
      console.error(err);
      next(err)
    })
  } catch (err) {
    console.error(err);
    next(err)
  }
}


exports.closeAlarmEvent = async (req, res, next) => {
  try{
    RobotService.closeAlarmEvent(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(err=>{
      console.error(err);
      next(err)
    })
  } catch (err) {
    console.error(err);
    next(err)
  }
}