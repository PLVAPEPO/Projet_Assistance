require('dotenv').config();
let con = require('./db')
var express = require('express');
var app = express()


var createError = require('http-errors');
const password = process.env.password;
var session = require('express-session')
var path = require('path');
var methodOverride = require('method-override');
var crypto = require('crypto');
var HELMET = require('helmet');
var methodOverride = require('method-override');
app.use(HELMET());
var logger = require('morgan');
app.use(logger('dev'));





//crypting
const algorithm = 'aes-192-cbc';
const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0);



// view engine setup
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



var indexRouter = require('./routes/index');
var billetsRouter = require('./routes/billets');
var billetRouter = require('./routes/billet');
var ajouterBilletRouter = require('./routes/ajouterBillet');
var rechercheRouter = require('./routes/recherche');
var statsRouter = require('./routes/stats');
var errorsRouter = require('./routes/errors');


var checkLoggedIn = (req, res, next) => req.session.connected ? next() : res.redirect("/");

var login = function (req, res, next) {
  let query = 'SELECT IdPersonne, PseudoPersonne, MDPPersonne, PrenomPersonne, NomPersonne, RolePersonne FROM PERSONNE WHERE PseudoPersonne = ?';
  con.query(query, req.body.uname, (err, rows) => {
      if (err) res.redirect("/errors");
      let cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(req.body.psw, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      console.log(encrypted)
      if(rows.length === 1 && rows[0].MDPPersonne === encrypted)
      {
        req.session.connected=true;
        req.session.msg = [];
        req.session.idPersonne = rows[0].IdPersonne;
        req.session.pseudo = rows[0].PseudoPersonne;
        req.session.prenom = rows[0].PrenomPersonne;
        req.session.nom = rows[0].NomPersonne;
        req.session.role = rows[0].RolePersonne;
        res.redirect('/billets');
      }
      else
      {
        res.redirect('/');
      }      
  });


}
var logout = function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) res.redirect("/errors");
    next();
  })
}


app.use('/login', login, billetsRouter);
app.use('/logout', logout, indexRouter);
app.use('/billets', checkLoggedIn, billetsRouter);
// app.use('/billets',checkLoggedIn, billetsRouter);
app.use('/billet/', billetRouter);

app.use('/billet',checkLoggedIn, billetRouter);
app.use('/recherche',checkLoggedIn, rechercheRouter);
app.use('/stats',checkLoggedIn,statsRouter);
app.use('/ajouterBillet',checkLoggedIn, ajouterBilletRouter);
app.use('/billet', checkLoggedIn, billetRouter);
app.use('/recherche', rechercheRouter);
app.use('/stats', statsRouter);
app.use('/ajouterBillet', checkLoggedIn, ajouterBilletRouter);
app.use('/errors', checkLoggedIn,errorsRouter)
app.use('/', indexRouter);
app.use('/index', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('errors');
});


app.listen(8080);