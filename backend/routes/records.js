var express = require('express');
var router = express.Router();
const recordController = require('../controllers/record.controller');

router.get('/', recordController.read)
router.post('/', recordController.create)
router.put('/', recordController.update)
router.delete('/:id', recordController.delete)

module.exports = router;
