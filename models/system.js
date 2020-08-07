const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
mongoose.set('useCreateIndex', true);


const Schema = mongoose.Schema;

const systemSettingSchema = new Schema({
    title:{
        type:String,
        required:true,        
    },
    shortTitle:{
        type:String,
        required:true,        
    },
    footer:{
        type:String,
        required:true
    }
});    

module.exports = mongoose.model('SystemSetting', systemSettingSchema);