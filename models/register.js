require('dotenv').config();
const mongoose = require ("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
    firstsignup:{
        type:String,
        required:true

    },
    lastsignup:{
        type:String,
        required:true
        
    },
    emailsignup:{
        type:String,
        required:true,
        unique:true
    },
    phonesignup:{
        type:Number,
        required:true
    },
    passwordsignup:{
        type:String,
        required:true
    },
    passwordsignup_confirm:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    

    
})

//generating tokrn

studentSchema.methods.generateAuthToken = async function() {
    try {
    //console.log(this._id);
    const token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
    this.tokens =this.tokens.concat({token:token});
    await this.save();
    return token;
        
    } catch (error) {
        res.end("the error part "+ error);
        //console.log("the error part in thegenerate of token "+ error);
    }
    
}


studentSchema.pre("save",async function(next){

    if(this.isModified("passwordsignup")){
        
        this.passwordsignup = await bcrypt.hash(this.passwordsignup,10);
        this.passwordsignup_confirm = await bcrypt.hash(this.passwordsignup_confirm,10);;
    }
    next();
    
})



const Register = new mongoose.model("Register",studentSchema);

module.exports = Register;

