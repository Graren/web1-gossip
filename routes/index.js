var express = require('express');
var ejs = require('ejs');
var router = express.Router();
let count = 0;

router.get('/', function(req, res) {
  res.redirect('/home');
});

router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/admin', function(req, res) {
  res.render('admin');
});

router.get('/user/:user', function(req, res) {
  res.render('user', {user: req.params.user});
});

router.get('/search', function(req, res) {
  res.render('search');
});

router.get('/logs', function(req, res) {
  res.render('logs');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/gossip/up', function(req, res) {
  res.send({message: 'good'});
});

router.post('/gossip/down', function(req, res) {
  res.send({message: 'good'});
});

router.post('/gossip/create', function(req, res) {
  count++;
  res.send({
    message: 'Good',
    data: {
      id_gossip: count,
      status: 1,
      karma: 0,
    }
  });
});


module.exports = router;
