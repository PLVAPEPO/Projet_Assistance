let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/:id', function (req, res, next) {
    
    let query = 'SELECT * FROM BILLET JOIN PROBLEME ON BILLET.IDPROBLEME = PROBLEME.IDPROBLEME WHERE BILLET.IDBILLET = ?';
    con.query(query, req.params.id, (err, rows) => {
        if (err) throw err;
        res.render('billet', { 'billet': rows});
    });
});

module.exports = router;
