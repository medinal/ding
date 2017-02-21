//require configuration file
var authConfig = require('./config/auth.json');

// require express
var express = require('express'),
    app = express();

//require findOrCreate which can be used to create new users.
var findOrCreate = require('mongoose-find-or-create');

//requires body parser for form fields.
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//requres mongoose to manage database
var mongoose = require('mongoose');

//requires passport for managing logins
var passport = require('passport');

//requires express-session for persistent logins
var session = require('express-session');

//requires the google auth strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//imports our models folder to get our schemas
var db = require('./models');

//imports our controllers folder to get our controllers
var controllers = require('./controllers');

//sets folders that will be used by the application
app.use(express.static('public'));
app.use(express.static('vendor'));
app.use(express.static('views'));

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}))

app.use(passport.initialize());
app.use(passport.session());


// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id, function (err, user) {
    done(null, user);
  });
});


//sets passport to use the Google OAuth using the secret key provided by Google
passport.use(new GoogleStrategy(
  authConfig.google,
  function(request, accessToken, refreshToken, profile, done) {
    db.User.findOrCreate({name: profile.displayName }, function (err, user) {
      return done(err, user);
    });
  }
));

// require handlebars view engine
app.set('view engine', 'hbs');

//directs to login page
app.get('/', function homepage(req, res) {
  res.render('index', {
    user: req.user,
  });
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['openid email profile'], prompt: 'select_account' }));


app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/')
});


app.get('/logout', function(req,res){
 req.logOut();
 req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

//***************
//*Course Routes*
//***************

//get all courses
app.get('/courses', ensureAuthenticated, controllers.course.all);
app.post('/courses', ensureAuthenticated, controllers.course.create);
app.put('/courses', ensureAuthenticated, controllers.course.edit);
app.delete('/courses', ensureAuthenticated, controllers.course.remove);


//***************
//*User Routes*
//***************

//create a new user
app.post('/users', controllers.user.create);


// //***************
// //*Enroll Routes*
// //***************

// //get all enrollment for every user
app.get('/enrolls', ensureAuthenticated, controllers.enroll.all);
app.post('/enrolls', ensureAuthenticated, controllers.enroll.create);
app.delete('/enrolls', ensureAuthenticated, controllers.enroll.unenroll);
app.delete('/enrolls/single/:enrollId', ensureAuthenticated, controllers.enroll.removeEnroll);


//************************
//*Setup Server to Listen*
//************************

app.listen(process.env.PORT || 3000, function () {
   console.log('Express server is up and running on http://localhost:3000/');
});

//simple authentication to ensure a user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {res.redirect('/');
  }
}
