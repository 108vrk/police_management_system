const PoliceStation = require('../models/policeStation');
const policeOfficers = require('../models/user');
const policeStation = require('../models/policeStation');

exports.getpoliceSations = (req, res, next) => { 
   res.locals.user = req.session.user;
  
   //console.log('Inside get police stations');

    PoliceStation.find({deleteStatus:0})
                 .then(policeStations => {
                    res.render('policeStations', {
                        policeStations: policeStations
                    });
                 })
                 .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                 });


    
  
};

exports.addPoliceSations = (req, res, next) => {
   res.locals.user = req.session.user;
    
    const policeStation = new PoliceStation({
        name:req.body.name,
        city:req.body.city,
        pincode:req.body.pincode,
        address:req.body.address,
        deleteStatus:0
    });
    policeStation.save()
                 .then(policeStation => {
                    //console.log('Police station added successfully');
                    //res.locals.success_message = 'Police station added successfully';
                    req.flash('success', 'Police station added successfully');                    
                    res.redirect('/policeStations');
                 })
                 .catch(err => {
                    //console.log('Could not add police station');
                    //res.locals.success_message = 'Could not add police station';
                    req.flash('error', 'Could not add police station');
                    res.redirect('/policeStations');
                 })

}

exports.deletePoliceSation = (req, res, next) => {
   res.locals.user = req.session.user;
    console.log(req.params.id);
    console.log('Inside delete police station');

    PoliceStation.findByIdAndUpdate({_id:req.params.id}, {deleteStatus:1})
                 .then(() => {
                    req.flash('success', 'Police station deleted successfully');                    
                    res.redirect('/policeStations');
                 })
                 .catch(err => {
                    req.flash('success', 'Could not delete police station');                    
                    res.redirect('/policeStations');
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                 });
                 
}

exports.editPoliceSation = (req, res, next) => {
   res.locals.user = req.session.user;

    PoliceStation.findById(req.body.id)
                 .then(policeStation => {
                     policeStation.name = req.body.name;
                     policeStation.city = req.body.city;
                     policeStation.pincode = req.body.pincode;
                     policeStation.address = req.body.address;

                     policeStation.save()
                                  .then(() => {
                                    req.flash('success', 'Police station updated successfully');                    
                                    res.redirect('/policeStations');
                                  })
                                  .catch(err => {
                                    req.flash('error', 'Could not delete police station');                    
                                    res.redirect('/policeStations');
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                    return next(error);
                                 })
                 })
                 .catch(err => {
                    req.flash('error', 'Police station does not exist to edit');                    
                    res.redirect('/policeStations');
                 });

                 
}

exports.getpoliceOfficers = (req, res, next) => {
   res.locals.user = req.session.user;
   policeOfficers.find({policeStation:req.params.id})
                 .then(officers => { console.log(officers);
                    res.render('officers_policeStations', {
                     officers: officers
                    });
                 })
                 .catch(err => {                  
                  const error = new Error(err);
                  error.httpStatusCode = 500;
                  req.flash('error', 'Could not find officers');                    
                  res.redirect('/policeStations');
                  return next(error);
});

}

exports.getExcel = (req, res, next) => {
   res.locals.user = req.session.user;
   const Excel = require('exceljs');

   // Create workbook & add worksheet
   const workbook = new Excel.Workbook();
   const worksheet = workbook.addWorksheet('PoliceStations');

   // add column headers
   worksheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'City', key: 'city' },
      { header: 'Pin Code', key: 'pin_code' },
      { header: 'Address', key: 'address' },
   ];
   
   policeStation.find({deleteStatus:0})
                .then(policeStations => {
                   for(let station of policeStations){
                     worksheet
                     .addRow([station.name, station.city, station.pincode, station.address]);
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