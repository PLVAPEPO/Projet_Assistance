let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	let query = 'SELECT * FROM ORDINATEUR';
	con.query(query, (err, rows) => {
		if (err) throw err;
		let query2 = 'SELECT * FROM PROBLEME';
		con.query(query2, (err, rows2) => {
			if (err) throw err;
			res.render('recherche', { 'ordis': rows, 'probs': rows2 });
		});
	});


});

router.post("/", function (req, res) {
	if (req.body.typeRechercheBillet == "") {
		res.redirect('/recherche')
	}
	else {
		// if (req.body.typeRechercheBillet == "titreBillet" || req.body.typeRechercheBillet == "") {

			let type = '' +  req.body.typeRechercheBillet + ''
			let query = "SELECT * FROM BILLET WHERE "+type+" like ?";
			let recherche = '%' + req.body.rechercheBillet.replace(/\//g,"-") + '%'
			// res.json(recherche)
			con.query(query, recherche, (err, rows) => {
				if (err) throw err;
				res.render('recherche', { 'billets': rows });
			});
		// }
	}
});

module.exports = router;
