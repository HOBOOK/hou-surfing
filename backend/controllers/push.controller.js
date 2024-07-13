const Push = require('../models/push');
const PushService = require('../services/push.service');

exports.create = async (req, res, next) => {
  try {
    const push = new Push(req.body)
    push.save();

    PushService.sendOnly('알림서비스가 구독되었습니다.', push.webhookUrl)
    res.status(201).json(push);
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.test = async (req, res, next) => {
  try{
    await PushService.sendTest(req.body.url)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(200).json(false)
    })
  }catch (err) {
    next(err)
  }
}


exports.update = async (req, res, next) => {
  try {
      await Push.findOne({
        _id: req.body._id
      })
      .then((result)=>{
          if(result){
              for(let k of Object.keys(req.body)) {
                if(k === '_id' || result[k] === req.body[k] || !req.body[k])
                  continue
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

exports.delete = async (req, res, next) => {
  try{
    await Push.findOneAndDelete({
      _id: req.params.id,
    })
    .then(result => {
      res.status(200).json(true)
    })
   
  } catch (err) {
    console.error(err);
    next(err)
  }
}
  

exports.read = async (req, res, next) => {
  try {
    await Push
    .find(req.query)
    .then((result) => {
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
};