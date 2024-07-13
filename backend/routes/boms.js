var express = require('express');
var router = express.Router();
const bomController = require('../controllers/bom.controller');

router.get('/', bomController.read)
router.post('/', bomController.create)
router.put('/', bomController.update)
router.delete('/', bomController.deleteById)
router.delete('/:serialNo', bomController.deleteBySerialNo)

module.exports = router;
