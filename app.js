require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const auth = require("./middels/auth");
const port = process.env.PORT || 3000;

const app = express();


mongoose.connect("mongodb://localhost:27017/iert", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log("connection success"))
    .catch((err) => console.log(err));

const Register = require("./models/register");
const ContactUs = require("./models/ContactUs");

const { json } = require("express");
const { log } = require("console");


const newpath = path.join(__dirname, "");
const viewpath = path.join(__dirname, "templets/views");
const temppath = path.join(__dirname, "templets/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(newpath));
app.set('view engine', 'hbs');
app.set('views', viewpath);
hbs.registerPartials(temppath);



app.post("/register", async (req, res) => {
    try {


        const password = req.body.passwordsignup;
        const cpassword = req.body.passwordsignup_confirm;

        if (password == cpassword) {
            const registerStudent = new Register({
                firstsignup: req.body.firstsignup,
                lastsignup: req.body.lastsignup,
                emailsignup: req.body.emailsignup,
                phonesignup: req.body.phonesignup,
                passwordsignup: req.body.passwordsignup,
                passwordsignup_confirm: req.body.passwordsignup_confirm
            })

            console.log("the success part  in the post registe" + registerStudent);

            const token = await registerStudent.generateAuthToken();
            //console.log("the token part in the post register" + token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 12300000),
                httpOnly: true
            });


            const registered = await registerStudent.save();
            //console.log("the page part " + registered);

            res.status(201).render("index");

        } else {
            res.send("password are not matching");
        }




    } catch (error) {
        res.status(400).send(error);


    }
})
app.post("/login", async (req, res) => {
    try {


        const email = req.body.username;
        const password = req.body.password;

        const usermail = await Register.findOne({ emailsignup: email });
        const isMatch = bcrypt.compare(password, usermail.passwordsignup);

        const token = await usermail.generateAuthToken();
        //console.log("the token part in the post login : " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 723000000),
            httpOnly: true,
        });

        // console.log ("the cookies status in the post login " + req.cookies.jwt);
         


        if (isMatch) {
            res.status(201).render("index");

        } else {
            res.send("invalid email or password ");
        }
    } catch (error) {
        res.status(400).send(error)

    }

});

app.post("/ContactUs", async (req, res) => {
    try {
        const registerContact = new ContactUs({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
            sem: req.body.sem,

        })

        const registered = await registerContact.save();
        //console.log("the page part " + registered);

        res.status(201).send("hello!!<br> " + "<strong><br>" + registered.name + "</strong><br>" + "Contact form successfully submitted");


    } catch (error) {
        res.status(401).send(error);

    }

})

app.get("/", auth, (req, res) => {
        res.render('index');
});
app.get("/Logout", auth, async(req, res , next) =>{
    try {
       // console.log(req.user);

        req.user.tokens = req.user.tokens.filter((currElement)=> {
            return currElement.token != req.token
        })

       // delete from database

        await res.clearCookie("jwt");
        await req.user.save();
        res.render('login');

    } catch (error) {
        res.status(500).send(error);
    }

});

app.get("/About", auth, (req, res) => {
    res.render('About');

});
app.get("/register", (req, res) => {
    res.render('register');

});
app.get("/login", (req, res) => {
    res.render('login');

});

app.get("/ContactUs", auth, (req, res) => {
    res.render('ContactUs');

});

app.get("/Student", auth, (req, res) => {
    res.render('Student');

});
app.get("/Electronics", auth, (req, res) => {
    res.render('Electronics');

});
app.get("/Civil", auth, (req, res) => {
    res.render('Civil');

});
app.get("/Mechanical", auth, (req, res) => {
    res.render('Mechanical');

});
app.get("/IC", auth, (req, res) => {
    res.render('IC');

});
app.get("/Plastic", auth, (req, res) => {
    res.render('Plastic');

});
app.get("/Electrical", auth, (req, res) => {
    res.render('Electrical');

});


app.get("*", (req, res) => {
    res.end("404 errror page");

});


app.listen(port, () => {
    console.log("server on");
});