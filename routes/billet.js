let con = require('../db');
var express = require('express');
var router = express.Router();
var idbill;

router.get('/:id', function (req, res, next) {
    idbill = req.params.id;
    let query = 'SELECT * FROM BILLET JOIN PROBLEME ON BILLET.IDPROBLEME = PROBLEME.IDPROBLEME WHERE BILLET.IDBILLET = ?';
    con.query(query, req.params.id, (err, rows) => {
        if (err) throw err;       
        res.render('billet', { 'billet': rows, pseudo: req.session.pseudo, role : req.session.role, prenom : req.session.prenom, nom: req.session.nom});
    });

});

router.post("/:id", function (req, res) {
    if (req.body.accept == 'accept') {
        con.query("Update BILLET set ETATBILLET ='1' where idbillet = ?", idbill, (err, rows) => {
            if (err) throw err;

            // res.json(req.body.titreBillet);
        });

        con.query("select IDPERSONNE FROM PERSONNE WHERE PseudoPersonne =?", req.session.pseudo, (err, rows) => {
            if (err) throw err;
            idpers = rows[0].IDPERSONNE
            var d = new Date();
            let dateY = d.getUTCFullYear()
            let dateM = d.getUTCMonth() + 2
            let dateD = d.getDate()
            let dateC = '' + dateY + '-' + dateM + '-' + dateD
            con.query('select max(IDINTERVENTION) as maxid from INTERVENTION', (err, rows) => {
                if (err) throw err;
                let idinter = rows[0].maxid
                console.log(idinter)
                con.query("Insert into ACCEPTE SET ?",
                    {
                        'IDBILLET': idbill,
                        'IDPERSONNE': idpers,
                        'IDINTERVENTION': idinter + 1,
                        'DATEFERMETUREBILLET': dateC,
                    },
                    (err, rows) => {
                        if (err) throw err;
                        // res.json(req.body.titreBillet);
                    });
                var d2 = new Date();
                let dateY2 = d2.getUTCFullYear()
                let dateM2 = d2.getUTCMonth() + 1
                let dateD2 = d2.getDate()
                let dateC2 = '' + dateY2 + '-' + dateM2 + '-' + dateD2
                con.query("Insert into INTERVENTION SET?",
                    {
                        'IDINTERVENTION': idinter + 1,
                        'DATEINTERVENTION': dateC2,
                        'TYPEINTERVENTION': '1',
                    },
                    (err, rows) => {
                        if (err) throw err;
                        let querys = 'SELECT DISTINCT p.IDPERSONNE,p.NOMPERSONNE, COUNT(ac.IDINTERVENTION) '
                        querys += ' FROM PERSONNE p'
                        querys += ' JOIN A_UNE a on a.idpersonne=p.idpersonne'
                        querys += ' JOIN ACCEPTE ac on ac.idpersonne=p.idpersonne'
                        querys += ' JOIN QUALIFICATION q on q.idqualification=a.idqualification'
                        querys += ' JOIN RESOUT r on q.idqualification=r.idqualification'
                        querys += ' JOIN PROBLEME pb on pb.idprobleme=r.idprobleme'
                        querys += ' JOIN BILLET b on b.idprobleme=pb.idprobleme'
                        querys += ' WHERE idbillet = ?'
                        querys += ' GROUP BY p.IDPERSONNE, p.NOMPERSONNE;'
                        con.query(querys,req.params.id,(err, rows) => {
                            if (err) throw err;
                            res.render('billet',{'billet':rows})
                        });
                    });
            });
        });
           
    }
    else if(req.body.accept == "refus")
    {

    }
    else
        res.redirect('/billets');

});

router.post("/", function (req, res) {

    res.redirect('/billets');
});


module.exports = router;
