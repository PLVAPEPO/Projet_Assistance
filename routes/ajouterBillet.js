let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('ajouterBillet')
});

router.get("/confirm",function(req, res) {
	console.log(req.query);
	con.query('INSERT INTO BILLET SET ?', { 'TITREBILLET': req.query.title, 'URGENCEBILLET': req.query.priority},
	 (err,rows) => {
		if(err) throw err;
		res.redirect('/tickets');
	  });
});

module.exports = router;
