const mongoose = require ("mongoose");




const noticeSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
        unique:true,
        
    },
    name:{
        type:String,
        required:true

    },
    
    message:{
        type:String,
        required:true,
        
    },

});

const Notice = new mongoose.model("Notice",noticeSchema);

module.exports = Notice;

