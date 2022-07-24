const mongoose = require ("mongoose");


const newstudentSchema = new mongoose.Schema({
    Rn:{
        type:String,
    },
    name:{
        type:String,
        required:true

    },
    branch:{
        type:String,
        required:true,
        
    },
    semester:{
        type:Number,
        required:true,
        
    },
    email:{
        type:String,

    },
    phone:{
        type:Number,
        required:true,
        
    },
    city:{
        type:String,
    }

});

const Student = new mongoose.model("Student",newstudentSchema);

module.exports = Student;