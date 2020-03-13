let con = require('../db');
var express = require('express');
var router = express.Router();

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

router.get('/', function (req, res, next) {
    var d = new Date();
    let query = 'SELECT * FROM BILLET ORDER BY DATECREATIONBILLET DESC, IDBILLET DESC';
    con.query(query, (err, rows) => {
        if (err) throw err;
        res.render('stats', {
            'stats': rows,  
            pseudo: req.session.pseudo, 
            role : req.session.role, 
            prenom : req.session.prenom,
            nom: req.session.nom});
    });
});

router.get('/:month', function (req, res, next) {
    let months = {
        '1': 'Janvier',
        '2': 'Février',
        '3': 'Mars',
        '4': 'Avril',
        '5': 'Mai',
        '6': 'Juin',
        '7': 'Juillet',
        '8': 'Aout',
        '9': 'Septembre',
        '10': 'Octobre',
        '11': 'Novembre',
        '12': 'Décembre',
    }
    let date = ''
    if (req.params.month == 0) {
        var d = new Date();
        date = d.getUTCMonth() + 1
        req.params.month = date
        if (date < 10) {date = "2020-0" + date + "-%"}
        else {date = "2020-" + date + "-%"}
    }
    else {
        if (req.params.month < 10) {date = "2020-0" + req.params.month + "-%"}
        else {date = "2020-" + req.params.month + "-%"}
    }

    let querys = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? ORDER BY IDBILLET;'
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.ETATBILLET = 0 ORDER BY IDBILLET;';
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.ETATBILLET = 1 ORDER BY IDBILLET;';
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.ETATBILLET = 2 ORDER BY IDBILLET;';
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 1 ORDER BY IDBILLET;';
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 2 ORDER BY IDBILLET;';
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 3 ORDER BY IDBILLET;';
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 4 ORDER BY IDBILLET;';
    querys += 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 5 ORDER BY IDBILLET;';
    let args = [date, date, date, date, date, date, date, date, date];


    con.query(querys, args, (err, rows) => {
        if (err) throw err;
        res.render('stats', {
            'stats': rows,
            'mois': months[req.params.month],
            'idmois' : req.params.month, 
            pseudo: req.session.pseudo,
            role : req.session.role,
            prenom : req.session.prenom,
            nom: req.session.nom});
    });
});

module.exports = router;
