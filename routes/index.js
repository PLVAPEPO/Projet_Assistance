let con = require('../db');
var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res, next) {
  req.session.destroy(function(err) {
    if(err) console.log(err);
    });
  let query = 'SELECT * FROM PERSONNE';
  con.query(query, (err, rows) => {
    if (err) throw err;
    res.render('index', { 'personnes': rows });
  });
});

router.post("/", function (req, res) {
  res.redirect('/billets');
});

module.exports = router;

