const Blackbox = require('../models/blackbox');
const Event = require('../models/event');

exports.getBlackboxes = async (req, res, next) => {
  try {
    await Blackbox
    .find(req.query)
    .then((result) => {
      res.status(200).json(result)
    })
    
  } catch (err) {
    console.error(err);
    next(err)
  }
}

exports.getBlackbox = async (req, res, next) => {
  try {
    const id = req.params.id

    const blackbox = await Blackbox.findOne({_id: id})

    if(blackbox) {
      await Event
      .find({
        timestamp: {
          $gte: new Date(blackbox.startTimestamp), 
          $lte: new Date(blackbox.endTimestamp)
        },
        'metadata.header.frame_id': 'rail'
      })
      .limit(blackbox.length)
      .then((result) => {
        res.status(200).json(result)
      })
    } else {
      res.status(200).json([])
    }
  } catch (err) {
    console.error(err);
    next(err)
  }
};