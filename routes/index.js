var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/home');
});

router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/login', function(req, res) {
  res.render('login');
});

module.exports = router;
