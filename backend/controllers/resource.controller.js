const minioClient = require('../plugins/minio');
const fs = require('fs');
const path = require('path');

 
exports.getObject = async (req, res, next) => {
  try {
      let bucket = 'rms';
      let key = decodeURIComponent(req.params[0])

      const list = req.query.list

      if(list) {
        const files = []
        const stream = minioClient.listObjects(bucket, key, req.query.recursive === 'true');

        stream.on('data', obj => files.push(obj));
        stream.on('end', () => res.send(files));
        stream.on('error', err => res.status(500).send(err.toString()));
      } else {
        minioClient.getObject(bucket, key, function(err, dataStream) {
          if (err) {
            return res.status(500).send(err);
          }
          dataStream.pipe(res);
        });
      }
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.postObject = async (req, res, next) => {
  try {
    const bucket = "rms";

    const tempDir = path.join(__dirname, 'temp'); 
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const file = req.files.file;
    const tempFilePath = path.join(tempDir, file.name);
    const key = decodeURIComponent(req.params[0])

    fs.writeFileSync(tempFilePath, file.data);
    const fileStream = fs.createReadStream(tempFilePath);

    minioClient.putObject(bucket, key, fileStream, file.size, function(err, etag) {
      fs.unlinkSync(tempFilePath);
      return err ? res.status(500).send(err) : res.status(200).json(key);
    });
  } catch (err) {
    console.error(err);
    next(err)
  }
}

exports.deleteObject = async (req, res, next) => {
  try {
      let bucket = 'rms';
      let key = decodeURIComponent(req.params[0])
      minioClient.removeObject(bucket, key, function(err) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        res.status(200).json(key)
      });
  } catch (err) {
    console.error(err);
    next(err)
  }
};