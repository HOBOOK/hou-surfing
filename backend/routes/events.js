var express = require('express');
var router = express.Router();
const eventController = require('../controllers/event.controller');

router.get('/', eventController.read)
router.post('/', eventController.create)
router.put('/', eventController.update)

module.exports = router;
