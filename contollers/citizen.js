const Citizen = require('../models/citizen');


exports.getCitizens = (req, res, next) => {
    res.locals.user = req.session.user;
    Citizen.find({deleteStatus:0})
           .then(citizen =>{
               res.render('citizen', {
                   citizens: citizen
               });
           })
           .catch()
}

exports.addCitizen = (req, res, next) => {
    res.locals.user = req.session.user;
    
    let citizen = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        aadhar: req.body.aadhar,
        address: req.body.address,
        image: req.file.path,
    }
    citizen = new Citizen(citizen);
    citizen.save()
           .then(citizen => {               
               req.flash('success', 'Citizen added successfully');                    
               res.redirect('/citizens');
           })
           .catch(err => {
               console.log(err);
               //res.locals.success_message = 'Could not add police station';
               req.flash('error', 'Could not add citizen');
               res.redirect('/citizens');
           });
}

exports.editCitizen = (req, res, next) => {
    res.locals.user = req.session.user;
    const citizen = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        aadhar: req.body.aadhar,
        address: req.body.address,
    }
        if(req.file){
            citizen.image = req.file.path;
        }
        Citizen.findByIdAndUpdate({_id:req.body.id}, citizen)
                .then(citizen => {               
                    req.flash('success', 'Citizen updated successfully');                    
                    res.redirect('/citizens');
                })
                .catch(err => {
                    console.log(err);
                    //res.locals.success_message = 'Could not add police station';
                    req.flash('error', 'Could not update citizen');
                    res.redirect('/citizens');
                });
}

exports.deleteCitizen = (req, res, next) => {
    res.locals.user = req.session.user;
    Citizen.findByIdAndUpdate({_id:req.params.id}, {deleteStatus:1})
            .then(citizen => {               
                req.flash('success', 'Citizen deleted successfully');                    
                res.redirect('/citizens');
            })
            .catch(err => {
                console.log(err);
                //res.locals.success_message = 'Could not add police station';
                req.flash('error', 'Could not delete citizen');
                res.redirect('/citizens');
            });
}

exports.getExcel = (req, res, next) => {
    res.locals.user = req.session.user;
    const Excel = require('exceljs');
 
    // Create workbook & add worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('PoliceOfficers');
 
    // add column headers
    worksheet.columns = [
       { header: 'First Name'},
       { header: 'Last Name'},
       { header: 'Email'},
       { header: 'Mobile'},
       { header: 'Aadhar'},
       { header: 'Address'},
    ];
    
    Citizen.find({deleteStatus:0, usertype: {$ne:1}})
                 .then(citizens => {
                    for(let citizen of citizens){                       
                      worksheet
                      .addRow([citizen.firstName, citizen.lastName, citizen.email, citizen.mobileNumber, citizen.aadhar, citizen.address]);
                    }
                   /* worksheet
                      .addRow(["peenya", "1", "2", "3"]); */
 
             
 
                      // save workbook to disk
                      const fileName = 'Excel/'+new Date()+'.xlsx';
                      workbook
                         .xlsx
                         .writeFile(fileName)
                         .then(() => {
                            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
 
                            workbook.xlsx.write(res).then(function(){
                               res.end();
                            });
                         console.log("saved");
                         })
                         .catch((err) => {
                         console.log("err", err);
                         });
                 })
                 .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    next(error);
                 })  
  
 
 }