let con = require('../db');
var express = require('express');
var router = express.Router();
var idbill;

router.get('/:id', function (req, res, next) {
    idbill = req.params.id;
    let query = 'SELECT * FROM BILLET JOIN PROBLEME ON BILLET.IDPROBLEME = PROBLEME.IDPROBLEME WHERE BILLET.IDBILLET = ?';
    con.query(query, req.params.id, (err, rows) => {
        if (err) throw err;       
        res.render('billet', { 'billet': rows, pseudo: req.session.pseudo});
    });
});

router.post("/", function (req, res) {
    con.query("Update BILLET set ETATBILLET ='1' where idbillet = ?",idbill,(err, rows) => {
            if (err) throw err;
            res.redirect('/billets');
            // res.json(req.body.titreBillet);
        });

});

module.exports = router;
