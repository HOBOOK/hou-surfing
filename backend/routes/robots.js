var express = require('express');
var router = express.Router();
const robotController = require('../controllers/robot.controller');

router.get('/', robotController.read)
router.post('/', robotController.create)
router.put('/', robotController.update)
router.get('/alarms', robotController.readAlarmEvent)
router.put('/alarms', robotController.closeAlarmEvent)

module.exports = router;
