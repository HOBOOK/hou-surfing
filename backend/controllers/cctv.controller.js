const Cctv = require("../models/cctv");

exports.create = async (req, res, next) => {
  try {
    const cctv = new Cctv(req.body);
    cctv.save();
    res.status(201).json(cctv._id);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await Cctv.findOne({
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
    await Cctv.find(req.query).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    await Cctv.findOneAndDelete({
      _id: req.query.id,
    }).then((result) => {
      res.status(200).json(true);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};