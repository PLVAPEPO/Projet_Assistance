let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    let query = 'SELECT * FROM BILLET';
    con.query(query, (err,rows) => {
      if(err) throw err;
      res.render('billets', {'billets':rows});
    });
  });

module.exports = router;
