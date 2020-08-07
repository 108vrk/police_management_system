const bcrypt = require('bcryptjs');

const User = require('../models/user');

const policeOfficers = require('../models/user');
const PoliceStation = require('../models/policeStation');
const Citizen = require('../models/citizen');
const Fir = require('../models/fir');
const policeStation = require('../models/policeStation');




const { getMaxListeners } = require('../models/user');

exports.getLogin = (req, res, next) => {
  if(req.session.isLoggedIn){
    return res.redirect('/dashboard');
  }
  res.render('login',{
    path: '',
    errorMessage: 'Email does not exists',
    oldInput: {
      email:'',
      password:''
    }
  });
}


exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
          if(!user){ //console.log('Email does not exist!');
            req.flash('error', 'Email does not exist');
            res.locals.error_message = req.flash('error');
            return res.status(422).render('login', {
              path: '',
              errorMessage: 'Email does not exists',
              oldInput: {
                email:email,
                password:password
              }
            });
          }
          bcrypt.compare(password, user.password)
                .then(doMatch => {
                  if(doMatch){  console.log('Login success');
                  //
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    res.locals.user = user;
                    /* req.session.save(err => {
                    console.log(err);
                    res.redirect('/dashboard');
                  }); */
                    req.session.save();
                    //res.setHeader('Content-Type', 'text/plain');
                    //console.log(req.session);
                   return res.redirect('/dashboard');
                  }
                  req.flash('error', 'Wrong Credentials');
                  res.locals.error_message = req.flash('error');
                  return res.status(422).render('login', {
                    path: '',
                    errorMessage: 'Wrong credentials',
                    oldInput: {
                      email:email,
                      password:password
                    } 
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('/login');
                })
        })
        .catch(err => {
          console.log('Email doest not exist');
        });

}

exports.logout = (req, res, next) => { //console.log('Inside logout function');
  req.session.destroy(err => {
   if(err){
    console.log(err);
   } 
   console.log('Logout success');
    res.redirect('/');
  });
};

exports.getProfile = (req, res, next) => {
  res.locals.user = req.session.user;
  //console.log(res.locals.user);
  let email = ''; 
  let _id = '';
  let firstName = '';
  let lastName = '';
  let mobileNumber = '';

    User.findOne({_id: req.session.user._id})
        .then(user => {
          //console.log('here'+user._id);
          //console.log('here'+user.email);
          //console.log('here'+req.session.user.firstName);

          email = user.email;
          image = user.image;
          if(user.firstName){
            firstName = user.firstName
          }
          if(user.lastName){
            lastName = user.lastName
          }
          if(user.mobileNumber){
            mobileNumber = user.mobileNumber
          }
         // console.log(email);console.log(firstName);console.log(lastName);console.log(mobileNumber);
          res.render('profile', {
            email : email,
            firstName : firstName,
            lastName : lastName,
            mobileNumber : mobileNumber,
            _id: req.session.user._id,
            image: image      
          });
        })
}

exports.postProfile = (req, res, next) => {
  
  let profileData = {
    firstName:req.body.firstName,lastName:req.body.lastName
  }
  const image = req.file;
  if(image){
    const imageURL = image.path;
    profileData.image = imageURL; 
  }


  if(req.body.password != ''){ // Password is set
    if(req.body.password != req.body.confirmPassword){
        req.flash('error', 'Password and Confirm password do not match');                    
        res.redirect('/auth/profile');
    }else{
      let hashedPassword;
      bcrypt.hash(req.body.password, 1)
            .then(password => {
              hashedPassword = password;
              profileData.password = hashedPassword;
              User.findByIdAndUpdate({_id:req.body.id}, profileData)
                  .then((user) => { 
                    res.locals.user = user;
                    req.flash('success', 'Profile updated successfully');                    
                    res.redirect('/auth/profile');
                  })
                  .catch(err => {                    
                    req.flash('error', 'Could not update profile');                    
                    res.redirect('/auth/profile');                    
                  })
            })
            .catch(err => {                    
              req.flash('error', 'Could not update profile');                    
              res.redirect('/auth/profile');                    
            })
    }
  }else{  // Password is not set
    User.findByIdAndUpdate({_id:req.body.id}, profileData)
    .then((user) => {
      res.locals.user = user;
      req.flash('success', 'Profile updated successfully');                    
      res.redirect('/auth/profile');
    })
    .catch(err => {                    
      req.flash('error', 'Could not update profile');                    
      res.redirect('/auth/profile');                    
    })
  }

}

exports.dashboard = (req, res, next) => {
  res.locals.user = req.session.user;
  Promise.all([
    Citizen.countDocuments({deleteStatus:0}).exec(),
    policeOfficers.countDocuments({deleteStatus:0}).exec(),
    policeStation.countDocuments({deleteStatus:0}).exec(),
    Fir.countDocuments({deleteStatus:0}).exec(),
  ]).then(count => {    
    return res.render('dashboard',{
      citizens:count[0],
      policeOfficers:count[1],
      policeStations:count[2],
      firs:count[3],
    });
  });


  
}
