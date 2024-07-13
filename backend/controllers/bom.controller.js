const Bom = require("../models/bom");

exports.create = async (req, res, next) => {
  try {
    const bom = new Bom(req.body);

    await Bom.findOne({
      serialNo: bom.serialNo,
    }).then((u) => {
      if (!u) {
        bom.save();
        res.status(201).json(bom._id);
      } else {
        res.status(errorcode.p003.status).json(errorcode.p003);
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await Bom.findOne({
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
    await Bom.find(req.query)
      .populate("parts.part")
      .then((result) => {
        res.status(200).json(result);
      });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    await Bom.findOneAndDelete({
      _id: req.query.id,
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
    await Bom.findOneAndDelete({
      serialNo: req.params.serialNo,
    }).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
