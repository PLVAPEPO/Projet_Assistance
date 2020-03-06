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
        res.render('stats', { 'stats': rows });
    });
});

router.get('/:month', function (req, res, next) {
    let query = 'SELECT COUNT(*) AS "NBBILLETS" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? ORDER BY IDBILLET';
    let date = ''

    let months = {
        '1':'Janvier',
        '2':'Fevrier',
        '3':'Mars',
        '4':'Avril',
        '5':'Mai',
        '6':'Juin',
        '7':'Juillet',
        '8':'Aout',
        '9':'Septembre',
        '10':'Octobre',
        '11':'Novembre',
        '12':'Decembre',
    }

    if (req.params.month == 0) {
        var d = new Date();
        date = d.getUTCMonth() + 1
        if (date < 10) {
        date = "2020-0"+date+"-%"
        }
        else {
            date = "2020-"+date+"-%"
        }
    }
    else {
        if (req.params.month < 10) {
            date = "2020-0" + req.params.month + "-%"
        }
        else {
            date = "2020-" + req.params.month + "-%"
        }
    }
    con.query(query, date, (err, rows) => {
        if (err) throw err;
<<<<<<< HEAD
        res.render('stats', { 'stats': rows, 'mois' : months[req.params.month]});
        //  res.json(months[req.params.month])
=======
        // res.render('stats', { 'stats': rows, 'mois' : req.params.month});
        res.json(rows)
>>>>>>> 7b590dbdf9a1a6decb528c612edecdedbaf9a56d
    });
});

module.exports = router;
