const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const User = require('./models/user');


const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

let MONGODB_URI = 'mongodb://localhost:27017/police';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(session({secret: 'my_secret',resave: false,saveUninitialized: false}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));


const authRoutes = require('./routes/auth');

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  console.log(req.session.user);
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      //redirect('dashboard');
      next();
    })
    .catch(err => { 
      next(new Error(err));
    });
});


app.use('/auth', authRoutes);


app.get('', function (req, res, next) {
  res.render('login');
  next();
});

app.get('/', function (req, res, next) {
    res.render('login');
    next();
  });

app.get('/login', function (req, res) {
    res.render('login');
    next();
  });  

app.get('/dashboard', function (req, res) {
  //res.setHeader('Content-Type', 'text/plain');
    if(!req.session.user){
      res.render('login');
      next();
    }
    res.render('dashboard');
    next();
  });



app.use((req, res, next) => {
    res.render('404');
    next();
});



mongoose
  .connect(MONGODB_URI, {useUnifiedTopology:true, useNewUrlParser:true})
  .then(result => {
    console.log('Application started');
    app.listen(7000);
  })
  .catch(err => {
    console.log(err);
  });