var express = require('express');
var router = express.Router();
const partController = require('../controllers/part.controller');

router.get('/', partController.read)
router.post('/', partController.create)
router.put('/', partController.update)
router.delete('/id/:id', partController.deleteById)
router.delete('/:serialNo', partController.deleteBySerialNo)
router.post('/file/:serialNo', partController.uploadCadFile)
router.delete('/file/:serialNo', partController.deleteCadFile)

module.exports = router;
