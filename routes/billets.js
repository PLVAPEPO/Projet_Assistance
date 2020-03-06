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
  // let date = '' + d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1, 2) + "-%"
  let query = 'SELECT * FROM BILLET ORDER BY DATECREATIONBILLET DESC, IDBILLET DESC';
  con.query(query, (err, rows) => {
    if (err) throw err;
    res.render('billets', { 'billets': rows });
  });
});

module.exports = router;
