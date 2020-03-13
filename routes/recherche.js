let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	res.render('recherche', {pseudo: req.session.pseudo});
});

router.post("/", function (req, res) {
	if (req.body.typeRechercheBillet == "") {
		res.redirect('/recherche')
	}
	else {
		let type = '' + req.body.typeRechercheBillet + ''
		let query = "SELECT * FROM BILLET WHERE " + type + " like ?";
		let recherche = '%' + req.body.rechercheBillet.replace(/\//g, "-") + '%'
		con.query(query, recherche, (err, rows) => {
			if (err) throw err;
			res.render('recherche', { 'billets': rows, pseudo: req.session.pseudo});
		});
	}
});

module.exports = router;
