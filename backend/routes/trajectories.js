var express = require('express');
var router = express.Router();
const taskController = require('../controllers/trajectory.controller');

router.get('/', taskController.read)
router.get('/:id', taskController.readById)
router.post('/', taskController.create)
router.put('/', taskController.update)
router.delete('/:id', taskController.delete)

module.exports = router;