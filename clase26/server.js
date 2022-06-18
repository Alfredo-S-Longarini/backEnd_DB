import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { conectarDB } from './src/controllersdb.js';
import bCrypt from 'bcrypt';

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----  ROUTES  -----------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getLogin(req, res){
  if (req.isAuthenticated()) {

      let user = req.user;
      console.log('user logueado');
      res.render('loginSuccessful', {
        usuario: user.username,
        nombre: user.firstName,
        apellido: user.lastName,
        email: user.email
      });
    }
    else {
      console.log('user no logueado');
      res.sendFile(__dirname+'/views/login.html');
    }
}

function getSignup(req, res) {
  res.sendFile(__dirname+'/views/signup.html');
}

function postLogin(req, res) {
  res.sendFile(__dirname+'/views/index.html');
}

function postSignup(req, res) {
  res.sendFile(__dirname+'/views/index.html');
}

function getFaillogin (req, res) {
  console.log('error en login');
  res.render('loginFail');
}

function getFailsignup (req, res) {
  console.log('error en signup');
  res.render('signupFail');
}

function getLogout (req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
}

function failRoute(req, res){
  res.status(404).render('routing-error', {});
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------



const User = mongoose.model('Users', {
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String
});



const app = express();
app.use((req, res, next) => {
  next()
});

app.use(express.static('clase26/views'));

app.set('views', __dirname+"/views");

app.set('view engine', '.hbs');

app.engine(
  '.hbs', 
  engine({ 
    extname: '.hbs',
    defaultLayout: 'index.hbs',
  })
);

app.use(session({
  secret: 'secretWord',
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 20000
  },
  rolling: true,
  resave: true,
  saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}
function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}



passport.use('registro', new Strategy({
  passReqToCallback: true
},
  (req, username, password, done) => {
    User.findOne({ 'username': username }, function (err, user) {

      if (err) {
        console.log('Error en registro: ' + err);
        return done(err);
      }

      if (user) {
        console.log('El usuario ya existe!!');
        return done(null, false)
      }

      const newUser = {
        username: username,
        password: createHash(password),
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }

      User.create(newUser, (err, userWithId) => {
        if (err) {
          console.log('Error al guardar el usuario: ' + err);
          return done(err);
        }
        console.log(user)
        console.log('Registro de usuario exitoso!');
        return done(null, userWithId);
      });
    });
  })
)
passport.use('login', new Strategy(
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err)
        return done(err);

      if (!user) {
        console.log('usuario "' + username +'" no encontrado!');
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        console.log('Contraseña invalida');
        return done(null, false);
      }

      console.log(user);
      return done(null, user);
    });
  })
);



passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, done);
});



//Login
app.get('/login', getLogin);
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), postLogin);
app.get('/faillogin', getFaillogin);

//Signup
app.get('/signup', getSignup);
app.post('/signup', passport.authenticate('registro', { failureRedirect: '/failsignup' }), postSignup);
app.get('/failsignup', getFailsignup);

//Logout
app.get('/logout', getLogout);

//Route Fail
app.get('*', failRoute);

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}
app.get('/ruta-protegida', checkAuthentication, (req, res) => {
  const { user } = req;
  console.log(user);
  res.send('<h1>Ruta OK!</h1>');
});



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----  Connect MongoDB  --------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
conectarDB('mongodb://127.0.0.1:27017/usuarios', err => {

  if (err) return console.log('error en conexión de base de datos', err);
  console.log('BASE DE DATOS CONECTADA');

  app.listen(8080, (err) => {
    if (err) return console.log('error en listen server', err);
    console.log(`Server running on port ${8080}`);
  });
});