let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	res.render('recherche', { pseudo: req.session.pseudo, role : req.session.role, prenom : req.session.prenom, nom: req.session.nom});
});

router.post("/", function (req, res) {
	if (req.body.typeRechercheBillet == "") {
		res.redirect('/recherche')
	}
	else {
		let type = '' + req.body.typeRechercheBillet + ''
		let query = "SELECT * FROM BILLET b JOIN PERSONNE p on p.IDPERSONNE = b.IDPERSONNE  WHERE p.IDPERSONNE = " + req.session.idPersonne + " && " + type + " like ?";
		let recherche = '%' + req.body.rechercheBillet.replace(/\//g, "-") + '%'
		con.query(query, recherche, (err, rows) => {
			if (err) {
				res.redirect("/errors");
			}
			res.render('recherche', { 'billets': rows, pseudo: req.session.pseudo, role : req.session.role, prenom : req.session.prenom, nom: req.session.nom});
		});
	}
});

module.exports = router;
