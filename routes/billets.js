let con = require('../db');
var express = require('express');
var router = express.Router();
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

router.get('/', function (req, res) {
  var d = new Date();
  if(req.session.role == 1)
  {
    let query = 'SELECT * FROM BILLET WHERE IDPERSONNE = ? ORDER BY DATECREATIONBILLET DESC, IDBILLET DESC';
    con.query(query, req.session.idPersonne , (err, rows) => {
      if (err) throw err;
      res.render('billets', { 'billets': rows, pseudo: req.session.pseudo, role : req.session.role, prenom : req.session.prenom, nom: req.session.nom, 'roleUser' : true});
    });
  }
  else {
    let query = 'SELECT * FROM BILLET b JOIN ACCEPTE a on a.IDBILLET = b.IDBILLET JOIN PERSONNE p on p.IDPERSONNE = a.IDPERSONNE WHERE p.ROLEPERSONNE = ? AND p.IDPERSONNE = ? ORDER BY DATECREATIONBILLET DESC, b.IDBILLET DESC';
    con.query(query, [req.session.role, req.session.idPersonne] , (err, rows) => {
      if (err) throw err;
      res.render('billets', { 'billets': rows, pseudo: req.session.pseudo, role : req.session.role, prenom : req.session.prenom, nom: req.session.nom, 'roleUser' : false});
    });
  }
  
});

module.exports = router;
