var express = require('express');
var router = express.Router();
const controller = require('../controllers/push.controller');

router.get('/', controller.read)
router.post('/', controller.create)
router.put('/', controller.update)
router.post('/test', controller.test)
router.delete('/:id', controller.delete)

module.exports = router;
