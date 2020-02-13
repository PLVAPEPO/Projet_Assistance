let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/:id', function(req, res) {
	con.query('SELECT * FROM ticket WHERE id = ?', req.params.id, (err,rows) => {
		if(err) throw err;
		res.json(rows);
	  });
});
  
router.get('/delete/:id', function(req, res) {
	con.query('DELETE FROM ticket WHERE id = ?', req.params.id, (err,rows) => {
		if(err) throw err;
		res.redirect('/tickets');
	  });
});

module.exports = router;