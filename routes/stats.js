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
    let months = {
        '1': 'Janvier',
        '2': 'Fevrier',
        '3': 'Mars',
        '4': 'Avril',
        '5': 'Mai',
        '6': 'Juin',
        '7': 'Juillet',
        '8': 'Aout',
        '9': 'Septembre',
        '10': 'Octobre',
        '11': 'Novembre',
        '12': 'Decembre',
    }
    let date = ''

    if (req.params.month == 0) {
        var d = new Date();
        date = d.getUTCMonth() + 1
        if (date < 10) {
            date = "2020-0" + date + "-%"
        }
        else {
            date = "2020-" + date + "-%"
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
    //Nombre de billets
    let query = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? ORDER BY IDBILLET';
    //Nombre de billets avec etat
    let query2 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.ETATBILLET = 0 ORDER BY IDBILLET ';
    let query3 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.ETATBILLET = 1 ORDER BY IDBILLET ';
    let query4 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.ETATBILLET = 2 ORDER BY IDBILLET ';
    //Nombre de billets par urgence
    let query5 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 1 ORDER BY IDBILLET';
    let query6 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 2 ORDER BY IDBILLET';
    let query7 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 3 ORDER BY IDBILLET';
    let query8 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 4 ORDER BY IDBILLET';
    let query9 = 'SELECT COUNT(*) AS "value" FROM BILLET WHERE BILLET.DATECREATIONBILLET LIKE ? AND BILLET.URGENCEBILLET = 5 ORDER BY IDBILLET';


    con.query(query, date, (err, rows) => {
        if (err) throw err;
        con.query(query2, date, (err, rows2) => {
            if (err) throw err;
            con.query(query3, date, (err, rows3) => {
                if (err) throw err;
                con.query(query4, date, (err, rows4) => {
                    if (err) throw err;
                    con.query(query5, [date, date, date], (err, rows5) => {
                        if (err) throw err;
                        con.query(query6, [date, date, date], (err, rows6) => {
                            if (err) throw err;
                            con.query(query7, [date, date, date], (err, rows7) => {
                                if (err) throw err;
                                con.query(query8, [date, date, date], (err, rows8) => {
                                    if (err) throw err;
                                    con.query(query9, [date, date, date], (err, rows9) => {
                                        if (err) throw err;
                                        res.render('stats',
                                            {
                                                'nbb': rows,
                                                'nbbnonterm': rows2,
                                                'nbbencours': rows3,
                                                'nbbterm': rows4,
                                                'urg1': rows5,
                                                'urg2': rows6,
                                                'urg3': rows7,
                                                'urg4': rows8,
                                                'urg5': rows9,
                                                'mois': months[req.params.month]
                                            });
                                        // res.json(rows5)
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
