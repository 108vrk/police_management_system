const policeOfficers = require('../models/user');
const PoliceStation = require('../models/policeStation');
const Citizen = require('../models/citizen');
const Fir = require('../models/fir');
const policeStation = require('../models/policeStation');

var citizen_list; let policeStations_list; let policeOfficers_list; let fir_list;

exports.getFirs = (req, res, next) => {
    res.locals.user = req.session.user;
   
    Fir.find({deleteStatus:0})
       .populate('by_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('against_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('policeStation', 'name city pincode address')
       .populate('enquiryOfficer', 'firstName lastName email mobileNumber address image')
       .then(firs => {
           res.render('fir/list_fir', {
               firs: firs
           });
       })
       .catch(err => {                           
        res.render('fir/list_fir', {
            firs: []
        });
       }) 
    
}

exports.getAddFir = (req, res, next) => {
    res.locals.user = req.session.user;
    Citizen.find({deleteStatus:0})
           .then(citizens => {
               citizen_list = citizens;
               policeStation.find({deleteStatus:0})
                            .then(policeStations => {
                                policeOfficers_list = policeStations;
                                res.render('fir/add_fir',{
                                    citizens:citizen_list,
                                    policeStations:policeOfficers_list
                                });
                            })
           })
           .catch(err => {
            const error = new Error(error);
            res.render('fir/add_fir',{
                citizens:[],
                policeStations:[]
            });
       })
    
}

exports.getOfficers = (req, res, next) => {
    res.locals.user = req.session.user;
    policeOfficers.find({policeStation:req.params.id})
                  .then(officers => {
                    //console.log(officers);
                    res.status(200).json({ status:'success', officers: officers });
                  })
                  .catch(err=>{
                    res.status(200).json({ status:'fail', officers: [] });  
                  })
}

exports.postAddFir = (req, res, next) => {
    res.locals.user = req.session.user;
    const firData = {
        by_citizen:req.body.by_citizen,
        against_citizen:req.body.against_citizen,
        policeStation:req.body.policeStation,
        enquiryOfficer:req.body.enquiryOfficer,
        incidentPlace:req.body.incidentPlace,
        incidentDate:req.body.incidentDate,
        firDate:Date.now(),
        firData:req.body.firData,
        status:1,
        deleteStatus:0
    }
    const FIR = new Fir(firData);
        FIR.save()
           .then(() => {
            req.flash('success', 'F I R added successfully');                    
            res.redirect('/firs');
           })
           .catch(err => {
            console.log(err);
            req.flash('error', 'Could not save F I R');                    
            res.redirect('/firs');
           })
}

exports.deleteFir = (req, res, next) => {
    res.locals.user = req.session.user;
    Fir.findByIdAndUpdate({_id:req.params.id}, {deleteStatus:1})
        .then(() => {
        req.flash('success', 'F I R deleted successfully');                    
        res.redirect('/firs');
       })
       .catch(err => {
        console.log(err);
        req.flash('error', 'Could not delete F I R');                    
        res.redirect('/firs');
       })
}

exports.getEditFir = (req, res, next) => {
    res.locals.user = req.session.user;
    Fir.findById(req.params.id)
       .populate('by_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('against_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('policeStation', 'name city pincode address')
       .populate('enquiryOfficer', 'firstName lastName email mobileNumber address image')
       .then(fir => {   console.log(fir);
           res.render('fir/edit_fir', {
               fir: fir
           });
       })
       .catch(err => {                           
        res.render('fir/edit_fir', {
            fir: []
        });
       }) 
}

exports.postEditFir = (req, res, next) => {
    res.locals.user = req.session.user;
    Fir.findByIdAndUpdate({_id:req.body.id}, {firData:req.body.firData, status:req.body.status})
        .then(() => {
                    
            req.flash('success', 'F I R updated successfully');
            res.redirect('/firs');
        })
        .catch(err => {
            console.log(err);            
            req.flash('error', 'Could not update F I R');
            res.redirect('/firs');
        })
}

exports.viewFir = (req, res, next) => {
    res.locals.user = req.session.user;
    Fir.findById(req.params.id)
       .populate('by_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('against_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('policeStation', 'name city pincode address')
       .populate('enquiryOfficer', 'firstName lastName email mobileNumber address image')
       .then(fir => {   console.log(fir);
           res.render('fir/view_fir', {
               fir: fir
           });
       })
       .catch(err => {                           
        res.render('fir/edit_fir', {
            fir: []
        });
       }) 
}

exports.printFir = (req, res, next) => {
    res.locals.user = req.session.user;
    Fir.findById(req.params.id)
       .populate('by_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('against_citizen', 'firstName lastName email mobileNumber aadhar address image')
       .populate('policeStation', 'name city pincode address')
       .populate('enquiryOfficer', 'firstName lastName email mobileNumber address image')
       .then(fir => {   console.log(fir);
           res.render('fir/print_fir', {
               fir: fir
           });
       })
       .catch(err => {                           
        res.render('fir/edit_fir', {
            fir: []
        });
       }) 
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


 exports.getExcel = (req, res, next) => {
    res.locals.user = req.session.user;
    const Excel = require('exceljs');
 
    // Create workbook & add worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('PoliceOfficers');
 
    // add column headers
    worksheet.columns = [
       { header: 'By Citizen'},
       { header: 'Against Citizen'},
       { header: 'Police Station'},
       { header: 'Enquiry Officer'},
       { header: 'Status'},
       { header: 'Details'},
    ];
    
    Fir.find({deleteStatus:0})
            .populate('by_citizen', 'firstName lastName email mobileNumber aadhar address image')
            .populate('against_citizen', 'firstName lastName email mobileNumber aadhar address image')
            .populate('policeStation', 'name city pincode address')
            .populate('enquiryOfficer', 'firstName lastName email mobileNumber address image')
            .then(firs => { 
                for(let fir of firs){//console.log(fir);
                    if(fir.status==1){
                        fir.status = 'Registered';
                      }else if(fir.status==2){
                        fir.status = 'Progress';
                      }else{
                        fir.status = 'Closed';
                      }
                worksheet
                .addRow([fir.by_citizen.firstName+' '+fir.by_citizen.lastName, fir.against_citizen.firstName+' '+fir.against_citizen.lastName, fir.policeStation.name, fir.enquiryOfficer.firstName+' '+fir.enquiryOfficer.lastName, fir.status, fir.firData]);
                }
            
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