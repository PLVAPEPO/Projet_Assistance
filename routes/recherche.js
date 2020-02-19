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

	// res.json(query + recherche)
	if (req.body.typeRechercheBillet == "") {
		res.redirect('/recherche')
	}
	else {
		if (req.body.typeRechercheBillet == "titreBillet") {
			let query = "SELECT * FROM BILLET WHERE TITREBILLET like ?";
			let recherche = '%' + req.body.rechercheBillet + '%'
			con.query(query, recherche, (err, rows) => {
				if (err) throw err;
				res.render('recherche', { 'billets': rows });
			});
		}
	}
});

/*router.post("/", function (req, res) {
		var d = new Date();
		let dateY = d.getUTCFullYear()
		let dateM = d.getUTCMonth() + 1
		let dateD = d.getDate()
		let dateC = '' + dateY + '-' + dateM + '-' + dateD
		con.query('INSERT INTO BILLET SET ?',
			{
				'TITREBILLET': req.body.titreBillet,
				'IDPROBLEME': req.body.problemeBillet,
				'URGENCEBILLET': req.body.urgenceBillet,
				'MESSAGEBILLET': req.body.messageBillet,
				'IDORDINATEUR': req.body.posteOrdinateur,
				'ETATBILLET': 0,
				'DATECREATIONBILLET': dateC
			},
			(err, rows) => {
				if (err) throw err;
				res.redirect('/');
				// res.json(req.body.titreBillet);
			});

});
 */

module.exports = router;
