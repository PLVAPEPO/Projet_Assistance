let con = require('../db');
var express = require('express');
var router = express.Router();
var idbill;
var msgArray;

var d = new Date();
let dateY = d.getUTCFullYear();
let dateM = d.getUTCMonth() + 1;
let dateD = d.getDate();

router.get('/:id', function (req, res, next) {
    idbill = req.params.id;
    msgArray = req.session.msg;
    let query = 'SELECT * FROM BILLET JOIN PROBLEME ON BILLET.IDPROBLEME = PROBLEME.IDPROBLEME WHERE BILLET.IDBILLET = ?';
    let query2 = 'SELECT * FROM COMMENTAIRE C JOIN BILLET B ON C.IDBILLET = B.IDBILLET WHERE B.IDBILLET = ? ORDER BY C.IDCOMMENTAIRE DESC'
    let query3 = 'SELECT * FROM INTERVENTION I JOIN BILLET B ON I.IDBILLET = B.IDBILLET WHERE B.IDBILLET = ? ORDER BY DATEINTERVENTION DESC, IDINTERVENTION DESC'
    let query4 = 'SELECT * FROM ACCEPTE WHERE IDBILLET = ?'
    con.query(query, idbill, (err, rows) => {
        if (err) {
            res.redirect("/errors");
        }
        con.query(query2, idbill, (err2, rows2) => {
            if (err2) {
                res.redirect("/errors");
            }
            con.query(query3, idbill, (err3, rows3) => {
                if (err3) {
                    res.redirect("/errors");
                }
                con.query(query4, idbill, (err4, rows4) => {
                    if (err4) {
                        res.redirect("/errors");
                    }
                    res.render('billet', { 'billet': rows, 'comms': rows2, 'inters':rows3, 'accepte':rows4, pseudo: req.session.pseudo, role: req.session.role, prenom: req.session.prenom, nom: req.session.nom, idpers: req.session.idPersonne, msg : msgArray});
                });
            });
        });
    });
});

router.post("/end/:id", function (req, res) {
    if (req.body.end == "end") {
        if (typeof req.params.id != 'undefined') {
            let query = "UPDATE BILLET SET ETATBILLET = 2 WHERE IDBILLET = " + req.params.id
            con.query(query, (err, rows) => {
                if (err) {
                    res.redirect("/errors");
                }
                let dateJ = dateY+"-"+dateM+"-"+dateD
                let query2 = "UPDATE ACCEPTE SET DATEFERMETUREBILLET = ? WHERE IDBILLET = ? AND DATEFERMETUREBILLET is NULL"
                con.query(query2,[dateJ,req.params.id], (err,rows2) =>{
                    if(err) {
                        throw err;
                    }
                    res.redirect("/billets")
                })
            })
        }
    }
})

router.post("/refus/:id/:idpb", function (req, res) {
    if (req.body.refus == "refus") {
        //Ici, incrémentation du nombre de redirection du billet
        let queryStart = "SELECT *"
        queryStart += " FROM BILLET"
        queryStart += " WHERE IDBILLET = " + req.params.id + ";"
        con.query(queryStart, (errStart, rowsStart) => {
            if (errStart) {
                res.redirect("/errors");
            }
            let queriesNb2 = "UPDATE BILLET SET NBREDIRECTIONBILLET = (NBREDIRECTIONBILLET+1) WHERE IDBILLET =" + req.params.id + ";"
            queriesNb2 += "SELECT * FROM BILLET WHERE IDBILLET = " + req.params.id + ";"
            con.query(queriesNb2, (errNb, rowsNb) => {
                if (errNb) {
                    res.redirect("/errors");
                }
                //Ici, on check le nombre de redirection, si il est < 3, on l'envoie à quelqu'un d'autre
                if (rowsNb[1][0].NBREDIRECTIONBILLET < 3) {

                    let query1 = 'SELECT DISTINCT p.IDPERSONNE,p.NOMPERSONNE, COUNT(a.IDBILLET)'
                        query1 += ' FROM BILLET b'
                        query1 += ' JOIN ACCEPTE a on a.IDBILLET=b.IDBILLET'
                        query1 += ' JOIN PERSONNE p on a.IDPERSONNE=p.IDPERSONNE'
                        query1 += ' JOIN A_UNE au on p.IDPERSONNE=au.IDPERSONNE'
                        query1 += ' JOIN QUALIFICATION q on q.IDQUALIFICATION=au.IDQUALIFICATION'
                        query1 += ' JOIN RESOUT r on r.IDQUALIFICATION=q.IDQUALIFICATION'
                        query1 += ' JOIN PROBLEME pb on pb.IDPROBLEME=r.IDPROBLEME'
                        query1 += ' WHERE pb.IDPROBLEME = '+req.params.idpb+' AND p.IDPERSONNE != '+req.session.idPersonne+''
                        query1 += ' GROUP BY p.IDPERSONNE,p.NOMPERSONNE'
                        query1 += ' ORDER BY COUNT(a.IDBILLET)'
                    con.query(query1, (err, rows) => {
                        if (err) {
                            res.redirect("/errors");
                        }
                        if (typeof rows[0].IDPERSONNE != 'undefined') {
                            let query2 = "UPDATE ACCEPTE SET IDPERSONNE=" + rows[0].IDPERSONNE + " WHERE IDBILLET = " + req.params.id + ""
                            con.query(query2, (err2, row2) => {
                                if (err2) {
                                    res.redirect("/errors");
                                }
                                res.redirect("/billets");
                            })
                        }
                    })
                }
                //Ici, si le nombre de redirection est > 3, on l'envoie au responsable
                else {
                    let query3 = 'SELECT DISTINCT IDPERSONNE FROM PERSONNE WHERE ROLEPERSONNE = 3'
                    con.query(query3, (err3, rows3) => {
                        if (err3) {
                            res.redirect("/errors");
                        }
                        let query4 = "UPDATE ACCEPTE SET IDPERSONNE=" + rows3[0].IDPERSONNE + " WHERE IDBILLET = " + req.params.id + ""
                        con.query(query4, (err4, rows4) => {
                            if (err4) {
                                res.redirect("/errors");
                            }
                            res.redirect("/billets")
                        })
                    })
                }
            })
        })
    }
})

router.post("/ajoutcomm", function (req, res) {
    if ((typeof req.body.titrecommentaire === 'string' || req.body.titrecommentaire instanceof String)
        && (typeof req.body.libellecommentaire === 'string' || req.body.libellecommentaire instanceof String)) {

        let dateC2 = '' + dateY + '-' + dateM + '-' + dateD
        let queryAjout = "INSERT INTO COMMENTAIRE(IDBILLET, TITRECOMMENTAIRE, LIBELLECOMMENTAIRE, DATECOMMENTAIRE) VALUES ('" + req.body.idbilletajout + "',?,?,'" + dateC2 + "') "
        con.query(queryAjout,[req.body.titrecommentaire,req.body.libellecommentaire], (err, rows) => {
            if (err) {
                res.redirect("/errors");
            }
            res.redirect('/billet/' + req.body.idbilletajout)
        })
    }
    else {
        res.redirect("/errors")
    }
});

router.post("/ajoutinter", function (req, res) {
    if (typeof req.body.description === 'string' || req.body.description instanceof String) {
        if (dateM < 10) {
            dateM = '0' + dateM;
        }
        let dateC2 = '' + dateY + '-' + dateM + '-' + dateD
        let queryAjout = "INSERT INTO INTERVENTION(IDBILLET, DESCRIPTIONINTERVENTION, DATEINTERVENTION) VALUES ('" + req.body.idbilletajout + "',?,'" + dateC2 + "') "
        con.query(queryAjout,req.body.description, (err, rows) => {
            if (err) {
                res.redirect("/errors");
            }
            else{
                res.redirect('/billet/' + req.body.idbilletajout)
            }
        })
    }
    else {
        res.redirect("/errors")
    }

});

router.post("/modifDateFin", function (req, res) {
    
    let dateDeFin = req.body.dateFin;
    let annee = dateDeFin.substring(0,4);
    let mois = dateDeFin.substring(5,7);
    let jour = dateDeFin.substring(8,10);
    if(parseInt(mois) < parseInt(dateM) || parseInt(jour) < parseInt(dateD) || parseInt(annee) < parseInt(dateY) ){
        req.session.msg = ['error','Veuillez bien renseigner la date'];
        res.redirect('/billet/'+req.body.idBillet);
    }
    else {
        let query = "UPDATE ACCEPTE SET DATEFERMETUREBILLET = ? WHERE IDBILLET = ?"
        con.query(query,[req.body.dateFin,req.body.idBillet], (err, rows) => {
            if (err) throw err;
            req.session.msg = ['success','Modification appliqué'];
            res.redirect('/billet/'+req.body.idBillet);
        })
    }
    
});



module.exports = router;
