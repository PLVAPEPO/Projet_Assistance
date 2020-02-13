let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/:id', function(req, res) {
	con.query('DELETE FROM ticket WHERE id = ?', req.params.id, (err,rows) => {
		if(err) throw err;
		res.redirect('/');
	  });
});
  
module.exports = router;