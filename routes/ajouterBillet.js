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

		let querys = 'SELECT DISTINCT p.IDPERSONNE,p.NOMPERSONNE, COUNT(a.IDBILLET)'
			querys += ' FROM PERSONNE p'
			querys += ' JOIN ACCEPTE a on a.IDPERSONNE=p.idpersonne'
			querys += ' JOIN BILLET b on a.IDBILLET=b.IDBILLET'
			querys += ' JOIN PROBLEME pb on b.IDPROBLEME=pb.IDPROBLEME'
			querys += ' WHERE pb.IDPROBLEME = ? AND p.NOMPERSONNE NOT LIKE "%responsable%"'
			querys += ' GROUP BY p.IDPERSONNE,p.NOMPERSONNE'
			querys += ' ORDER BY COUNT(a.IDBILLET) ASC LIMIT 1'
		
			//Requete pour phpmyadmin
			// SELECT DISTINCT p.IDPERSONNE,p.NOMPERSONNE, COUNT(a.IDBILLET)
			//    FROM PERSONNE p
			//    JOIN ACCEPTE a on a.IDPERSONNE=p.idpersonne
			//    JOIN BILLET b on a.IDBILLET=b.IDBILLET
			//    JOIN PROBLEME pb on b.IDPROBLEME=pb.IDPROBLEME
			//    WHERE pb.IDPROBLEME = 1 AND p.NOMPERSONNE NOT LIKE "%responsable%"
			//    GROUP BY p.IDPERSONNE,p.NOMPERSONNE
			//    ORDER BY COUNT(a.IDBILLET) ASC LIMIT 1

		con.query(querys, req.body.problemeBillet,  (err, rows) => {
			if (err) throw err;
			con.query('INSERT INTO BILLET SET ?',
			{
				'IDPERSONNE' : req.session.idPersonne,
				'TITREBILLET': req.body.titreBillet,
				'IDPROBLEME': req.body.problemeBillet,
				'URGENCEBILLET': req.body.urgenceBillet,
				'MESSAGEBILLET': req.body.messageBillet,
				'IDORDINATEUR': req.body.posteOrdinateur,
				'PIECEJOINTEBILLET': '/images/'+ req.body.piecejointebillet,
				'ETATBILLET': 1,
				'NBREDIRECTIONBILLET':0,
				'DATECREATIONBILLET': dateC,
			},
			(errinsert, rowsinsert) => {
				if (errinsert) throw errinsert;
				con.query('INSERT INTO ACCEPTE SET ?',{
					'IDPERSONNE' : rows[0].IDPERSONNE,
					'IDBILLET' : rowsinsert.insertId
				},
				(errinsert2, rowsinsert2)=> {
					if (errinsert2) throw errinsert2
					res.redirect('/');
				});
			});
		});
		

});

module.exports = router;
