let con = require('../db');
var express = require('express');
var router = express.Router();
var idbill;

router.get('/:id', function (req, res, next) {
    idbill = req.params.id;
    let query = 'SELECT * FROM BILLET JOIN PROBLEME ON BILLET.IDPROBLEME = PROBLEME.IDPROBLEME WHERE BILLET.IDBILLET = ?';
    let query2 = 'SELECT * FROM COMMENTAIRE C JOIN BILLET B ON C.IDBILLET = B.IDBILLET WHERE B.IDBILLET = ? ORDER BY C.IDCOMMENTAIRE DESC'
    con.query(query, req.params.id, (err, rows) => {
        if (err) throw err;
        con.query(query2, req.params.id, (err2, rows2) => {
            if (err2) throw err2;
            // res.json(rows2)
            res.render('billet', { 'billet': rows, 'comms': rows2, pseudo: req.session.pseudo, role: req.session.role, prenom: req.session.prenom, nom: req.session.nom, idpers: req.session.idPersonne });
        });
    });
});

router.post("/end/:id", function (req, res) {
    if(req.body.end == "end") {
        let query = "UPDATE BILLET SET ETATBILLET = 2 WHERE IDBILLET = " +req.params.id
        con.query(query, (err, rows) => {
            if(err) throw err;
                res.redirect("/billets")
        })
    }
})

router.post("/refus/:id", function (req, res) {
    if (req.body.refus == "refus") {
        //Ici, incrémentation du nombre de redirection du billet
        let queryStart = "SELECT * FROM BILLET WHERE IDBILLET = " + req.params.id + ";"
        con.query(queryStart, (errStart, rowsStart) => {
            if (errStart) throw errStart;
            let queriesNb2 = "UPDATE BILLET SET NBREDIRECTIONBILLET = (NBREDIRECTIONBILLET+1) WHERE IDBILLET =" + req.params.id + ";"
            queriesNb2 += "SELECT * FROM BILLET WHERE IDBILLET = " + req.params.id + ";"
            con.query(queriesNb2, (errNb, rowsNb) => {
                if (errNb) throw errNb;
                //Ici, on check le nombre de redirection, si il est < 3, on l'envoie à quelqu'un d'autre
                if (rowsNb[1][0].NBREDIRECTIONBILLET < 3) {
                    let query1 = 'SELECT DISTINCT p.IDPERSONNE,p.NOMPERSONNE, COUNT(a.IDBILLET) FROM PERSONNE p JOIN ACCEPTE a on a.IDPERSONNE=p.idpersonne JOIN BILLET b on a.IDBILLET=b.IDBILLET JOIN PROBLEME pb on b.IDPROBLEME=pb.IDPROBLEME WHERE pb.IDPROBLEME = ' + req.params.id + ' GROUP BY p.IDPERSONNE,p.NOMPERSONNE ORDER BY COUNT(a.IDBILLET) ASC LIMIT 1'
                    con.query(query1, (err, rows) => {
                        if (err) throw err;
                        if (typeof rows[0].IDPERSONNE != undefined) {
                            let query2 = "UPDATE ACCEPTE SET IDPERSONNE=" + rows[0].IDPERSONNE + " WHERE IDBILLET = " + req.params.id + ""
                            con.query(query2, (err2, row2) => {
                                if (err2) throw err2;
                                res.redirect("/billets")
                            })
                        }
                    })
                }
                //Ici, si le nombre de redirection est > 3, on l'envoie au responsable
                else {
                    let query3 = 'SELECT DISTINCT IDPERSONNE FROM PERSONNE WHERE ROLEPERSONNE = 3'
                    con.query(query3, (err3, rows3) => {
                        if (err3) throw err3;
                        let query4 = "UPDATE ACCEPTE SET IDPERSONNE=" + rows3[0].IDPERSONNE + " WHERE IDBILLET = " + req.params.id + ""
                        con.query(query4, (err4, rows4) => {
                            if (err4) throw err4;
                            red.redirect("/billets")
                        })
                    })
                }
            })
        })
    }
})


router.post("/ajout", function (req, res) {
    var d2 = new Date();
    let dateY2 = d2.getUTCFullYear()
    let dateM2 = d2.getUTCMonth() + 1
    let dateD2 = d2.getDate()
    if (dateM2 < 10) {
        dateM2 = '0' + dateM2;
    }
    let dateC2 = '' + dateY2 + '-' + dateM2 + '-' + dateD2
    let queryAjout = "INSERT INTO COMMENTAIRE(IDBILLET, TITRECOMMENTAIRE, LIBELLECOMMENTAIRE, DATECOMMENTAIRE) VALUES ('" + req.body.idbilletajout + "','" + req.body.titrecommentaire + "','" + req.body.libellecommentaire + "','" + dateC2 + "') "
    con.query(queryAjout, (err, rows) => {
        if (err) throw err;
        res.redirect('/billet/' + req.body.idbilletajout)
    })
});


module.exports = router;
