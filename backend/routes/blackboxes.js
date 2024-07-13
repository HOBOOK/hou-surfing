var express = require('express');
var router = express.Router();
const blackboxController = require('../controllers/blackbox.controller');

router.get('/', blackboxController.getBlackboxes)
router.get('/:id', blackboxController.getBlackbox)

module.exports = router;
