const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const policeStation = require('./policeStation');
mongoose.set('useCreateIndex', true);


const Schema = mongoose.Schema;

const firSchema = new Schema({
    by_citizen:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Citizen'        
    },    
    against_citizen:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Citizen'       
    },
    policeStation:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'PoliceStation'
    },
    enquiryOfficer:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    incidentPlace:{
        type:String,
        required:true
    },
    incidentDate:{
        type:Date,
        required:true
    },
    firDate:{
        type:Date,
        required:true
    },
    firData:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true
    },            
    deleteStatus:{
        type:Number,
        required:true,
        default:0
    }    
});    

module.exports = mongoose.model('Fir', firSchema);