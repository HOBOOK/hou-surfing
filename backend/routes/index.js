var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RMS Socket Server' });
});

// health

router.get('/health', function(req, res, next) {
  res.status(200).json('ok')
})

// 소켓 테스트
router.get('/socket', function(req, res, next) {
  res.render('socket', { title: 'Socket' });
});

module.exports = router;
