let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/:id', function(req, res) {
	con.query('DELETE FROM BILLET WHERE IDBILLET = ?', req.params.id, (err,rows) => {
		if(err) throw err;
		res.redirect('/');
	  });
});

module.exports = router;
