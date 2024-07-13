var express = require('express');
var router = express.Router();
const factoryController = require('../controllers/factory.controller');

router.get('/', factoryController.read)
router.put('/', factoryController.update)
router.post('/', factoryController.create)
router.get('/process', factoryController.getProcess)

module.exports = router;
