let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('addticket')
});

router.get("/confirm",function(req, res) {
	console.log(req.query);
	con.query('INSERT INTO ticket SET ?', { 'title': req.query.title, 'priority': req.query.priority},
	 (err,rows) => {
		if(err) throw err;
		res.redirect('/tickets');
	  });
});

module.exports = router;