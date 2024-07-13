var express = require('express');
var router = express.Router();
const modelController = require('../controllers/model.controller');

router.get('/', modelController.readModel)
router.put('/', modelController.updateModel)
router.get('/object/*', modelController.readModelObject)

module.exports = router;
