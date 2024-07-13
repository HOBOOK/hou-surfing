var express = require('express');
var router = express.Router();
const controller = require('../controllers/test.controller');

router.post('/alarm', controller.createAlarm)

module.exports = router;
