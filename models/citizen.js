const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
mongoose.set('useCreateIndex', true);


const Schema = mongoose.Schema;

const citizenSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },    
    aadhar:{
        type:Number,
        required:true,
        unique:true
    },
    mobileNumber:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
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
    },
    image:{
        type:String,
        default:'no-image'
    }
});    

module.exports = mongoose.model('Citizen', citizenSchema);