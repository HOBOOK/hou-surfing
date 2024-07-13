const Factory = require('../models/factory');
const Robot = require('../models/robot');
const Part = require('../models/part');
const Trajectory = require('../models/trajectory');
const Bom = require('../models/bom');


exports.getFactories = async (req, res, next) => {
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
}

exports.getRobots = async (req, res, next) => {
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
}

exports.getParts = async (req, res, next) => {
  try {
    await Part
    .find(req.query)
    .then((result) => {
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
}

exports.getTrajectories = async (req, res, next) => {
  try {
    await Trajectory
    .find(req.query)
    .then((result) => {
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
}

exports.getBoms = async (req, res, next) => {
  try {
    await Bom.find(req.query)
    .populate("parts.part")
    .then((result) => {
      res.status(200).json(result);
    });
    
  } catch (err) {
    console.error(err);
    next(err)
  }
}