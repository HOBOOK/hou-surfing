const Task = require("../models/task");

exports.create = async (req, res, next) => {
  try {
    const task = new Task(req.body);
    task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await Task.findOne({
      _id: req.body._id,
    }).then((result) => {
      if (result) {
        for (let k of Object.keys(req.body)) {
          if (
            k === "_id" ||
            k === "_v" ||
            result[k] === req.body[k] ||
            !req.body[k]
          )
            continue;
          // if (Array.isArray(req.body[k]) && req.body[k].length === 0) continue;
          result[k] = req.body[k];
        }
        result.save();
        res.status(200).json(result);
      } else {
        res.status(400).json({
          message: "잘못된 요청",
          code: "",
        });
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
    }).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    await Task.find(req.query)
      .populate({
        path: "bom",
        populate: {
          path: "parts.part",
        },
      })
      .then((result) => {
        res.status(200).json(result);
      });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.readById = async (req, res, next) => {
  try {
    await Task.findOne({
      _id: req.params.id,
    })
      .populate({
        path: "bom",
        populate: {
          path: "parts.part",
        },
      })
      .then((result) => {
        res.status(200).json(result);
      });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
