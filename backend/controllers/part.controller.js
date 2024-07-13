const Part = require("../models/part");
const Bom = require("../models/bom");
const minioClient = require("../plugins/minio");
const fs = require("fs");
const path = require("path");

exports.create = async (req, res, next) => {
  try {
    const part = new Part(req.body);
    part.save();
    res.status(201).json(part._id);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await Part.findOne({
      _id: req.body._id,
    }).then((result) => {
      if (result) {
        for (let k of Object.keys(req.body)) {
          if (k === "_id" || result[k] === req.body[k] || !req.body[k])
            continue;
          result[k] = req.body[k];
        }
        result.save();
        res.status(200).json(result);
      } else {
        res.status(errorcode.p002.status).json(errorcode.p002);
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    await Part.find(req.query).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    await Part.findOneAndDelete({
      _id: req.params.id,
    }).then((result) => {
      res.status(200).json(true);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteBySerialNo = async (req, res, next) => {
  try {
    await Part.deleteMany({
      serialNo: req.params.serialNo,
    });
    res.status(200).json(true);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.uploadCadFile = async (req, res, next) => {
  try {
    const serialNo = req.params.serialNo
    const bucket = "rms";

    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const file = req.files.file;
    const tempFilePath = path.join(tempDir, file.name);
    const key = `/parts/${serialNo}/${file.name}`;

    fs.writeFileSync(tempFilePath, file.data);
    const fileStream = fs.createReadStream(tempFilePath);

    minioClient.putObject(
      bucket,
      key,
      fileStream,
      file.size,
      function (err, etag) {
        fs.unlinkSync(tempFilePath);
        return err ? res.status(500).send(err) : res.status(200).json(key);
      }
    );
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteCadFile = async (req, res, next) => {
  try {
    const serialNo = req.params.serialNo;

    const bucket = "rms";

    const stream = await minioClient.listObjects(bucket, `parts/${serialNo}/`, true);

    const objectsToDelete = []
    for await (const obj of stream) {
        objectsToDelete.push(obj.name);
    }

    if(objectsToDelete.length) {
      const response = await minioClient.removeObjects(bucket, objectsToDelete, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
      });
    }
    res.status(200).json(true);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteCadFileBySerialNo = async (req, res, next) => {
  try {
    const serialNo = req.params.serialNo;
    const bucket = "rms";
    const prefix = `parts/cad/${serialNo}/`;

    const objectsList = [];
    const stream = minioClient.listObjects(bucket, prefix, true);

    await new Promise((resolve, reject) => {
      stream.on("data", function (obj) {
        objectsList.push(obj.name);
      });
      stream.on("error", function (err) {
        reject(err);
      });
      stream.on("end", function () {
        resolve();
      });
    });

    minioClient.removeObjects(bucket, objectsList, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.status(200).json(serialNo);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
