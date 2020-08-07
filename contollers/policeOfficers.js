const policeOfficers = require('../models/user');
const PoliceStation = require('../models/policeStation');
const policeStation = require('../models/policeStation');
const { off } = require('../models/user');

const bcrypt = require('bcryptjs');



exports.getpoliceOfficers = (req, res, next) => { 
   res.locals.user = req.session.user;
  
   //console.log(policeOfficers);

   policeOfficers.find({deleteStatus:0})
                 .then(policeOfficers => { let myStation;
                  //console.log(policeOfficers[2].policeStation);
                  //policeOfficers[2]['test']= 'sample';
                  
                                                                   
                  myArray = [];
                  
                  for(let officer of policeOfficers){
                     if(officer.usertype!=1){
                        policeStation.find({_id:officer.policeStation})
                                  .then(station => { //console.log(station[0].name);
                                    let offierDetails = {
                                       _id:officer._id,
                                       firstName:officer.firstName,
                                       lastName:officer.lastName,
                                       mobileNumber:officer.mobileNumber,
                                       email:officer.email,
                                       usertype:officer.usertype,
                                       address:officer.address,
                                       firstName:officer.firstName,
                                       policeStationId:officer.policeStation,
                                       policeStation:station[0].name                  
                                    };
                                    //console.log('checked data is '+offierDetails.policeStationId); 
                                    
                                    myArray.push(offierDetails); 
                                  })
                                  .catch()
                     }else{
                        myArray.push(officer);
                     }
                     
                  }
                  //console.log(typeof offierDetails);
                  policeOfficers = myArray;

                     policeStation.find()
                                  .then(policeStations => {                                    
                                    res.render('policeOfficers', {
                                       policeOfficers: policeOfficers,
                                       policeStations: policeStations
                                      });
                                  })
                                  .catch(err => {
                                       const error = new Error(err);
                                       error.httpStatusCode = 500;
                                       return next(error);
                                    });  
                    
                 })
                 .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                 });


    
  
};

exports.addPoliceOfficer = (req, res, next) => {
   res.locals.user = req.session.user;
    
   policeOfficers.find({email:req.body.email, mobileNumber:req.body.mobileNumber})
                 .then(officer => { console.log(officer);
                    if(officer.length > 0){
                     req.flash('error', 'Either Email ID or Mobile number already exists');
                     res.redirect('/policeOfficers');
                    }
                    let hashedPassword;
                    bcrypt.hash('password', 1)
                          .then(password => { console.log(password);
                           hashedPassword = password;
                           const policeOfficer = new policeOfficers({
                              firstName:req.body.firstName,
                              lastName:req.body.lastName,
                              email:req.body.email,
                              mobileNumber:req.body.mobileNumber,
                              address:req.body.address,
                              usertype:req.body.usertype,
                              password:hashedPassword,
                              policeStation:req.body.policeStation,
                              deleteStatus:0
                          });
                          policeOfficer.save()
                                    .then(policeOfficer => {
                                       //console.log('Police station added successfully');
                                       //res.locals.success_message = 'Police station added successfully';
                                       req.flash('success', 'Police officer added successfully');                    
                                       res.redirect('/policeOfficers');
                                    })
                                    .catch(err => {
                                       console.log(err);
                                       //res.locals.success_message = 'Could not add police station';
                                       req.flash('error', 'Could not add police officer');
                                       res.redirect('/policeOfficers');
                                    });
                          })
                    
                     
                     })
                 .catch(err => {
                  //console.log('Could not add police station');
                  //res.locals.success_message = 'Could not add police station';
                  req.flash('error', 'Could not add police officer');
                  res.redirect('/policeOfficers');
               }); 


    

}

exports.deletePoliceOfficer = (req, res, next) => {
   res.locals.user = req.session.user;
    //console.log(req.params.id);
    //console.log('Inside delete police station');

   policeOfficers.findByIdAndUpdate({_id:req.params.id}, {deleteStatus:1})
                 .then(() => {
                  req.flash('success', 'Police officer deleted successfully');                    
                  res.redirect('/policeOfficers')
                 })
                 .catch((err) => {
                  req.flash('success', 'Could not delete police officer');                    
                  res.redirect('/policeOfficers');
                  const error = new Error(err);
                  error.httpStatusCode = 500;
                  return next(error);
                 });
              
}

exports.editPoliceOfficer = (req, res, next) => {
   res.locals.user = req.session.user;

   policeOfficers.findById(req.body.id)
                 .then(policeOfficer => {
                     policeOfficer.firstName = req.body.firstName;
                     policeOfficer.lastName = req.body.lastName;
                     policeOfficer.email = req.body.email;
                     policeOfficer.mobileNumber = req.body.mobileNumber;
                     policeOfficer.address = req.body.address;
                     policeOfficer.usertype = req.body.usertype;
                     policeOfficer.policeStation = req.body.policeStation;
                     

                     policeOfficer.save()
                                  .then(() => {
                                    req.flash('success', 'Police officer updated successfully');                    
                                    res.redirect('/policeOfficers');
                                  })
                                  .catch(err => {
                                    req.flash('error', 'Could not delete police officer');                    
                                    res.redirect('/policeOfficers');
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                    return next(error);
                                 })
                 })
                 .catch(err => {
                    req.flash('error', 'Police officer does not exist to edit');                    
                    res.redirect('/policeOfficers');
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
      { header: 'User Type'},
      { header: 'Address'},
   ];
   
   policeOfficers.find({deleteStatus:0, usertype: {$ne:1}})
                .then(policeOfficers => {
                   for(let officer of policeOfficers){
                      if(officer.usertype == 2){
                        officer.usertype = 'Inspector';
                      }else if(officer.usertype == 3){
                        officer.usertype = 'Enquiry Officer';
                      }else{
                        officer.usertype = 'Constable';
                      }
                     worksheet
                     .addRow([officer.firstName, officer.lastName, officer.email, officer.mobileNumber, officer.usertype, officer.address]);
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