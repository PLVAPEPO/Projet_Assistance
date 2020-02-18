let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	let query = 'SELECT * FROM ORDINATEUR';
	con.query(query, (err, rows) => {
		if (err) throw err;
		res.render('ajouterBillet', { 'ordis': rows });
	});

});

router.get("/confirm", function (req, res) {
	console.log(req.query);
	con.query('INSERT INTO BILLET SET ?', { 'TITREBILLET': req.query.title, 'URGENCEBILLET': req.query.priority },
		(err, rows) => {
			if (err) throw err;
			res.redirect('/tickets');
		});
});

router.post("/", function (req, res) {
	console.log(req.query);
	con.query('INSERT INTO BILLET SET ?', { 'TITREBILLET': req.query.title, 'URGENCEBILLET': req.query.priority },
		(err, rows) => {
			if (err) throw err;
			// res.redirect('/tickets');
			res.json(rows);
		});
});

module.exports = router;
