const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const policeStationSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    deleteStatus:{
        type:Number,
        required:true,
        default:0
    }
});    

module.exports = mongoose.model('PoliceStation', policeStationSchema);