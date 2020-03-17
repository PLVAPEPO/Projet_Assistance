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
			res.render('ajouterBillet', { 'ordis': rows, 'probs': rows2, pseudo: req.session.pseudo, role : req.session.role, prenom : req.session.prenom, nom: req.session.nom});
		});
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
		var d = new Date();
		let dateY = d.getUTCFullYear()
		let dateM = d.getUTCMonth() + 1
		let dateD = d.getDate()
		let dateC = '' + dateY + '-' + dateM + '-' + dateD
		con.query('INSERT INTO BILLET SET ?',
			{
				'IDPERSONNE' : 1,
				'TITREBILLET': req.body.titreBillet,
				'IDPROBLEME': req.body.problemeBillet,
				'URGENCEBILLET': req.body.urgenceBillet,
				'MESSAGEBILLET': req.body.messageBillet,
				'IDORDINATEUR': req.body.posteOrdinateur,
				'PIECEJOINTEBILLET': '/images/'+ req.body.piecejointebillet,
				'ETATBILLET': 0,
				'DATECREATIONBILLET': dateC,
			},
			(err, rows) => {
				if (err) throw err;
				res.redirect('/');
				// res.json(req.body.titreBillet);
			});

});

module.exports = router;
