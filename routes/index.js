let con = require('../db');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;



var login = function(req, res) {
  req.session.connected=true;
}

var checkIfLoggedIn = function(req, res, next) {
  if(req.session.loggedIn)
    next();
  else
    res.redirect("/index");
}

var logout = function(req, res){
  req.session.destroy(function(err) {
    if(err) console.log(err);
    res.redirect('/');
  })
}