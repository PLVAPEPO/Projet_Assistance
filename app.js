let con = require('./db')
var express = require('express');
var app = express()


var createError = require('http-errors');
var session = require('express-session')
var path = require('path');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var HELMET = require('helmet');
var methodOverride = require('method-override');
app.use(HELMET());
var logger = require('morgan');
app.use(logger('dev'));

require('dotenv').config();



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))


var indexRouter = require('./routes/index');
var billetsRouter = require('./routes/billets');
var billetRouter = require('./routes/billet');
var ajouterBilletRouter = require('./routes/ajouterBillet');
var rechercheRouter = require('./routes/recherche');
var statsRouter = require('./routes/stats');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


var checkLoggedIn = (req, res, next) => req.session.connected ? next() : res.redirect("/");

var login = function (req, res, next) {

  let query = 'SELECT PseudoPersonne, MDPPersonne FROM Personne WHERE PseudoPersonne = ?';

  con.query(query, req.body.uname, (err, rows) => {
    if (err) throw err;
    if (rows.length === 1 && rows[0].MDPPersonne === req.body.psw) {
      console.log(rows[0].MDPPersonne,rows[0].PseudoPersonne)
      req.session.connected = true;
      res.redirect('/billets');
      //next();
    }
    else {
      res.redirect('/');
    }
  });


}
var logout = function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) console.log(err);
    next();
  })
}

app.use('/login', login, billetsRouter);
app.use('/logout', logout, indexRouter);
app.use('/billets', checkLoggedIn, billetsRouter);
// app.use('/billets',checkLoggedIn, billetsRouter);
app.use('/billet', checkLoggedIn, billetRouter);
app.use('/recherche', rechercheRouter);
app.use('/stats', statsRouter);
app.use('/ajouterBillet', checkLoggedIn, ajouterBilletRouter);
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
  res.render('error');
});


app.listen(8080);