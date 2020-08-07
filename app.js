const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const flash = require('connect-flash');
app.use(flash());

const User = require('./models/user');


const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const multer = require('multer');
const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString()+'-'+file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ){
    cb(null, true)
  }else{
    cb(null, false)
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

let MONGODB_URI = 'mongodb://localhost:27017/police';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(session({secret: 'my_secret',resave: true,saveUninitialized: true, store: store, cookie : {maxAge : 360000000}}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


const authRoutes = require('./routes/auth');
const policeStationsRoutes = require('./routes/policeStations');
const policeOfficersRoutes = require('./routes/policeOfficers');
const citizenRoutes = require('./routes/citizen');
const firRoutes = require('./routes/fir');
const systemRoutes = require('./routes/system');

const { render } = require('ejs');
const { createBrotliCompress } = require('zlib');

const PORT = 7000;


app.use((req, res, next) => {
  res.locals.error_message = req.flash('error');
  res.locals.success_message = req.flash('success');
 // console.log(res.locals.error_message.length);
  res.locals.baseURL = 'http://localhost:'+PORT;
  //console.log(res.locals.baseURL);
  next();
});

app.use((req, res, next) => {
 
  if (!req.session.user) {
    //return next();
    render('login');
    return next();
  }
  
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      
      next();
    })
    .catch(err => { 
      next(new Error(err));
    });
});


app.use('/auth', authRoutes);
app.use('/dashboard', authRoutes);
app.use('/policeStations', policeStationsRoutes);
app.use('/policeOfficers', policeOfficersRoutes);
app.use('/citizens', citizenRoutes);
app.use('/firs', firRoutes);
app.use('/system', systemRoutes);


app.get('', function (req, res, next) {
  res.redirect('/auth/login');
});

app.get('/', function (req, res, next) {
  res.redirect('/auth/login');
});

app.get('/login', function (req, res, next) {
  res.redirect('/auth/login');
});





app.get('/login', function (req, res) {
    res.render('login',{
      path: '',
      errorMessage: 'Email does not exists',
      oldInput: {
        email:'',
        password:''
      }
    });
    //next();
  });  

/* app.get('/dashboard', function (req, res) {
  //res.setHeader('Content-Type', 'text/plain');
    if(!req.session.user){
      return res.render('login', {
        oldInput: {
          email:'',
          password:''
        }
      });
      //next();
    }
    return res.render('dashboard',{
      firstName:req.session.user.firstName,
      lastName:req.session.user.lastName
    });
    //next();
  }); */

  app.get('/criminalRecords', function (req, res) {   
    res.locals.user = req.session.user; 
      return res.render('criminal_records');
    });

  app.get('/prisionerRecords', function (req, res) {  
    res.locals.user = req.session.user;  
      return res.render('prisioner_records');
      //next();
    }); 



app.use((req, res, next) => {
    res.render('404');
    next();
});



mongoose
  .connect(MONGODB_URI, {useUnifiedTopology:true, useNewUrlParser:true})
  .then(result => {
    console.log('Application started');
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });