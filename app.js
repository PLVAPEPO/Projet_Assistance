var express = require('express');
var app = express()

var createError = require('http-errors');
var session = require('express-session')
var path = require('path');
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

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport')

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log('Inside local strategy callback')
    // here is where you make a call to the database
    // to find the user based on their username or email address
    // for now, we'll just pretend we found that it was users[0]
    const user = users[0] 
    if(email === user.email && password === user.password) {
      console.log('Local strategy returned true')
      return done(null, user)
    }
  }
));

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


var checkLoggedIn = (req, res, next) => req.session.loggedIn ? next(): res.redirect("/");

var login = function(req, res, next) {
  // let query = 'SELECT PseudoPersonne, MdpPersonne FROM PERSONNE WHERE BILLET.IDBILLET = ?';
  //   con.query(query, req.params.id, (err, rows) => {
  //       if (err) throw err;
  //       res.render('/');
  //   });
  // if(req.query.password == req.params.password && req.query.)
  req.session.connected=true;
  next();
}

var logout = function(req, res, next){
  req.session.destroy(function(err) {
    if(err) console.log(err);
    res.redirect('/');
  })
}


// app.use('/login',login,billetsRouter);
app.use('/index', indexRouter)
app.use('/logout',logout,indexRouter);
app.use('/billets', billetsRouter);
// app.use('/billets',checkLoggedIn, billetsRouter);
app.use('/billet', billetRouter);
app.use('/ajouterBillet', ajouterBilletRouter);
app.use('/recherche', rechercheRouter);
app.use('/stats', statsRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(8080);