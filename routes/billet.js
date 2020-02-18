let con = require('../db');
var express = require('express');
var router = express.Router();


router.get('/:id', function (req, res, next) {
    let query = 'SELECT * FROM BILLET WHERE IDBILLET = ?';
    con.query(query, req.params.id, (err, rows) => {
        if (err) throw err;
        res.render('billet', { 'billet': rows });
        // res.json(rows);
    });
});

module.exports = router;
