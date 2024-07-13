var express = require('express');
var router = express.Router();
const cctvController = require('../controllers/cctv.controller');

router.get('/', cctvController.read)
router.post('/', cctvController.create)
router.put('/', cctvController.update)
router.delete('/', cctvController.deleteById)

module.exports = router;
