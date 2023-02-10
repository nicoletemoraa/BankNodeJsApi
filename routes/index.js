var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', {title: 'Bank Information', result: 'this is the data' });
  
});

module.exports = router;
