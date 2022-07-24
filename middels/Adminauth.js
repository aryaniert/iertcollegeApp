const jwt = require("jsonwebtoken");
const RegisterAdmin = require("../models/AdminRegister");

const Adminauth = async (req, res, next) => {
   try {
       const token = req.cookies.jwt;
       const verifyUser = jwtAdmin.verify(token, process.env.SECRET_KEY);
       console.log("verifying the Adminauth" + verifyUser);

       const user = await RegisterAdmin.findOne({_id:verifyUser._id});
       console.log("getting user detail in the Adminauth : " + user.firstsignup);
       console.log("getting user detail in the Adminauth : " + user);

       req.token = token;
       req.user = user;
       next();
       
   } catch (error) {
       res.render('AdminLogin');
       
   }
}

module.exports = Adminauth;