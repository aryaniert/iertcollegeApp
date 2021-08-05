const mongoose = require ("mongoose");




const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true
        
    },
    phone:{
        type:Number,
        required:true,
        
    },
    message:{
        type:String
        
    },
    sem:{
        type:Number
    }

});

const ContactUs = new mongoose.model("ContactUs",contactSchema);

module.exports = ContactUs;

