var express = require('express');
var router = express.Router();
const resourceController = require('../controllers/resource.controller');

router.get('/*', resourceController.getObject)
router.post('/*', resourceController.postObject)
router.delete('/*', resourceController.deleteObject)

module.exports = router;
