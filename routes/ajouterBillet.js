let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	if ((typeof req.session.idPersonne === 'number' && isFinite(req.session.idPersonne))
		&& (typeof req.session.role === 'number' && isFinite(req.session.role))
		&& (typeof req.session.pseudo === 'string' || req.session.pseudo instanceof String)
		&& (typeof req.session.prenom === 'string' || req.session.prenom instanceof String)
		&& (typeof req.session.nom === 'string' || req.session.nom instanceof String)
	) {
		let query = 'SELECT * FROM ORDINATEUR';
		con.query(query, (err, rows) => {
			if (err) {
				res.redirect("/errors");
			}
			let query2 = 'SELECT * FROM PROBLEME';
			con.query(query2, (err, rows2) => {
				if (err) {
					res.redirect("/errors");
				}
				res.render('ajouterBillet', { 'ordis': rows, 'probs': rows2, pseudo: req.session.pseudo, role: req.session.role, prenom: req.session.prenom, nom: req.session.nom });
			});
		});
	}
	else {
		res.redirect("/errors");
	}

});

router.get("/confirm", function (req, res) {
	con.query('INSERT INTO BILLET SET ?', { 'TITREBILLET': req.query.title, 'URGENCEBILLET': req.query.priority },
		(err, rows) => {
			if (err) {
				res.redirect("/errors");
			}
			res.redirect('/tickets');
		});
});

router.post("/", function (req, res) {
	if ((typeof req.session.idPersonne === 'number' && isFinite(req.session.idPersonne))
		&& (typeof req.body.titreBillet === 'string' || req.body.titreBillet instanceof String)
		&& (typeof req.body.problemeBillet === 'string' || req.body.problemeBillet instanceof String)
		&& (typeof req.body.urgenceBillet === 'string' || req.body.urgenceBillet instanceof String)
		&& (typeof req.body.messageBillet === 'string' || req.body.messageBillet instanceof String)
		&& (typeof req.body.posteOrdinateur === 'string' || req.body.posteOrdinateur instanceof String)
		&& (parseInt(req.body.urgenceBillet) >= 1 && parseInt(req.body.urgenceBillet) <= 5)) {

		var d = new Date();
		let dateY = d.getUTCFullYear()
		let dateM = d.getUTCMonth() + 1
		let dateD = d.getDate()
		let dateC = '' + dateY + '-' + dateM + '-' + dateD


		
		let querys = 'SELECT DISTINCT p.IDPERSONNE,p.NOMPERSONNE, COUNT(a.IDBILLET)'
			querys += ' FROM BILLET b'
			querys += ' JOIN ACCEPTE a on a.IDBILLET=b.IDBILLET'
			querys += ' JOIN PERSONNE p on a.IDPERSONNE=p.IDPERSONNE'
			querys += ' JOIN A_UNE au on p.IDPERSONNE=au.IDPERSONNE'
			querys += ' JOIN QUALIFICATION q on q.IDQUALIFICATION=au.IDQUALIFICATION'
			querys += ' JOIN RESOUT r on r.IDQUALIFICATION=q.IDQUALIFICATION'
			querys += ' JOIN PROBLEME pb on pb.IDPROBLEME=r.IDPROBLEME'
			querys += ' WHERE pb.IDPROBLEME = ? AND p.NOMPERSONNE NOT LIKE "%responsable%"'
			querys += ' GROUP BY p.IDPERSONNE,p.NOMPERSONNE'
			querys += ' ORDER BY COUNT(a.IDBILLET) ASC LIMIT 1'
	

		con.query(querys, req.body.problemeBillet, (err, rows) => {
			if (err) {
				res.redirect("/errors");
			}
			con.query('INSERT INTO BILLET SET ?',
				{
					'IDPERSONNE': req.session.idPersonne,
					'TITREBILLET': req.body.titreBillet,
					'IDPROBLEME': req.body.problemeBillet,
					'URGENCEBILLET': req.body.urgenceBillet,
					'MESSAGEBILLET': req.body.messageBillet,
					'IDORDINATEUR': req.body.posteOrdinateur,
					'PIECEJOINTEBILLET': '/images/' + req.body.piecejointebillet,
					'ETATBILLET': 1,
					'NBREDIRECTIONBILLET': 0,
					'DATECREATIONBILLET': dateC,
				},
				(errinsert, rowsinsert) => {
					if (errinsert) {
						res.redirect("/errors");
					}
					con.query('INSERT INTO ACCEPTE SET ?', {
						'IDPERSONNE': rows[0].IDPERSONNE,
						'IDBILLET': rowsinsert.insertId
					},
						(errinsert2, rowsinsert2) => {
							if (errinsert2) {
								res.redirect("/errors");
							}
							res.redirect('/billets');
						});
				});
		});

	} else {
		res.redirect("/errors")
	}

});



module.exports = router;
