const bcrypt = require('bcryptjs');

const SystemSetting = require('../models/system');

exports.getSystem = (req, res, next) => {
    res.locals.user = req.session.user;
    SystemSetting.find()
          .then(system => {console.log(system);
            res.render('system', {  
                system:system
            });
          })
          .catch(err => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              next(error);
          })
}

exports.postSystem = (req, res, next) => {
    res.locals.user = req.session.user;
    
    SystemSetting.findByIdAndUpdate({_id:'5f291287b653c51de7a2b47d'}, {title:req.body.title, shortTitle:req.body.shortTitle, footer:req.body.footer})
                 .then(() => {
                    req.flash('success', 'System settings updated successfully');                    
                    res.redirect('/system')
                 })
                 .catch(err => {
                    req.flash('error', 'Could not update system settings');                    
                    res.redirect('/system')
                })
}