var express = require('express');
var router = express.Router();
const publicController = require('../controllers/public.controller');

router.get('/factories', publicController.getFactories)
router.get('/robots', publicController.getRobots)
router.get('/parts', publicController.getParts)
router.get('/trajectories', publicController.getTrajectories)
router.get('/boms', publicController.getBoms)


module.exports = router;
