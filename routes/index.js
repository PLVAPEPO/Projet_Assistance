//let con = require('../db');
var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
console.log('Yes')

module.exports = router;

router.post('/billets',function(req, res, next) {
  function Connexion()
  {
    if(uname="" && psw =="")
    {
      res.redirect('index',{title: 'Express'});
    }
    else
    {
      res.redirect('/billets',{title:'Billets'});
    }
  }
});
