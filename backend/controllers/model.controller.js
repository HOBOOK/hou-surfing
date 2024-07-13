const Model = require('../models/model');
const minioClient = require('../plugins/minio');
const fs = require('fs');


 
exports.createModel = async (req, res, next) => {
  try {
    const newModel = new Model(req.body)

    await Model.find({ 
            $or: [{
                email: newModel.email
            },{
                id: user.id
            }] 
        })
        .then((u)=>{
            if(!u || u.length === 0){
                newModel.save();
                res.status(201).json(newModel);
            }else{
                res.status(400).json({
                message: '잘못된 데이터.',
                data: null
            });
        }
    })
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.updateModel = async (req, res, next) => {
    try {
        const model = new Model(req.body)
        await Model.findOne({
          _id: model._id
        })
        .then((result)=>{
            if(result){
                result.position = model.position ? model.position : result.position
                result.rotation = model.rotation ? model.rotation : result.rotation
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
  

exports.readModel = async (req, res, next) => {
  try {
    await Model
    .find(req.query)
    .then((result) => {
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.readModelObject = async (req, res, next) => {
    try {
        let bucket = 'rms';
        let key = decodeURIComponent(req.params[0])

        minioClient.getObject(bucket, key, function(err, dataStream) {

            if (err) {
              console.error(err)
              return res.status(500).send(err);
            }
            dataStream.pipe(res);
        });
      
    } catch (err) {
      console.error(err);
      next(err)
    }
};