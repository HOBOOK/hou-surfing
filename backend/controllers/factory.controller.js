const Factory = require('../models/factory');

 
exports.create = async (req, res, next) => {
  try {
    const newFactory = new Factory(req.body)

    await Factory.findOne({
          name: req.body.name
        })
        .then((u)=>{
            if(!u || u.length === 0){
                newFactory.save();
                res.status(201).json(newFactory);
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

exports.update = async (req, res, next) => {
    try {
        await Factory.findOne({
          _id: req.body._id
        })
        .then((result)=>{
            if(result){
              updateObject(result, req.body)
              
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

function updateObject(original, changes) {
  Object.keys(changes).forEach((key) => {

    if(key === '_id' || key === '_v')
      return

    if(!original || !original[key]) {
      original[key] = changes[key]
    }

    if (Array.isArray(changes[key])) {

      if (!Array.isArray(original[key])) {
        return
      }

      if(changes[key].length !== original[key].length) {
        original[key] = changes[key]
      } else {
        changes[key].forEach((item, index) => {
          if (item instanceof Object) {
            if (original[key][index] == null) {
              original[key][index] = {};
            }
            updateObject(original[key][index], item);
          } else {
            original[key][index] = item;
          }
        });
      }
      
    } else if (changes[key] instanceof Object) {
      let origJson = JSON.stringify(original[key])
      let chanJson = JSON.stringify(changes[key])

      if(origJson !== chanJson) {
        original[key] = changes[key]
      }
    } else {
      original[key] = changes[key];
    }
  });
}
  

exports.read = async (req, res, next) => {
  try {
    await Factory
    .find(req.query)
    .then((result) => {
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
};


exports.createGroup = async (req, res, next) => {
  try {
    const file = req.files.file;
    const group = req.geils.group

    res.status(200).json('ok')


    // const bucket = "rms";
    // const tempDir = path.join(__dirname, 'temp'); 
    // if (!fs.existsSync(tempDir)) {
    //   fs.mkdirSync(tempDir);
    // }

    

    // const tempFilePath = path.join(tempDir, file.name);
    // const key = `/assets/objects/${file.name}`

    // fs.writeFileSync(tempFilePath, file.data);
    // const fileStream = fs.createReadStream(tempFilePath);

    // minioClient.putObject(bucket, key, fileStream, file.size, function(err, etag) {
    //   fs.unlinkSync(tempFilePath);
    //   return err ? res.status(500).send(err) : res.status(200).json(key);
    // });
  } catch (err) {
    console.error(err);
    next(err)
  }
};


exports.getProcess = async (req, res, next) => {
  try{
    const result = await Factory.find(req.query)

    let process = []
    if(result) {
      for(let f of result) {
        for(let child of f.children) {
          if(child.type === 'process') {
            process.push(child)
          }
        }
      }
    } 
    res.status(200).json(process)

  } catch (err) {
    console.log(err)
    next(err)
  }
}

