const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req, res, next) => {
   try {
       const token = req.cookies.jwt;
       const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
       //console.log("verifying the auth" + verifyUser);

       const user = await Register.findOne({_id:verifyUser._id});
       //console.log("getting user detail in the auth : " + user.firstsignup);
       //console.log("getting user detail in the auth : " + user);

       req.token = token;
       req.user = user;


       next();
       
   } catch (error) {
       res.render('login');
       
   }
}

module.exports = auth;