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
  let query = 'SELECT * FROM BILLET WHERE IDPERSONNE = ? ORDER BY DATECREATIONBILLET DESC, IDBILLET DESC';
  con.query(query, req.session.idPersonne , (err, rows) => {
    if (err) throw err;
    res.render('billets', { 'billets': rows, pseudo: req.session.pseudo, role : req.session.role, prenom : req.session.prenom, nom: req.session.nom});
  });
});

module.exports = router;
