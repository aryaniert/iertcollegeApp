require("dotenv").config();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const express = require("express");
const requests = require("requests");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middels/auth");
const Adminauth = require("./middels/Adminauth");
const port = process.env.PORT || 1000;
const DB = process.env.DATABASE;
const app = express();
const getnotes = require("./router/notesmanage/getNotes");

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connection success"))
  .catch((err) => console.log(err));

//include all the schema here
const Register = require("./models/register");
const RegisterAdmin = require("./models/AdminRegister");
const Notice = require("./models/notic");
const ContactUs = require("./models/ContactUs");
const Student = require("./models/Student");

const { json } = require("express");
const { log } = require("console");
const { signedCookie } = require("cookie-parser");
const async = require("hbs/lib/async");

//include all the path
const newpath = path.join(__dirname, "");
const viewpath = path.join(__dirname, "templets/views");
const temppath = path.join(__dirname, "templets/partials");

app.use(express.json()); //imp
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

app.use(express.static(newpath));
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(temppath);

// All router path add here
app.use("/notes", getnotes);

app.get("/upload/notes", auth, (req, res) => {
  res.render("UploadNotes");
});

app.post("/notic", async (req, res) => {
  try {
    // console.log(req.body);
    const notice = new Notice(req.body);
    res.send(notice);
    notice.save();
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/notic", async (req, res) => {
  try {
    const noticeBoard = await Notice.find();
    res.send(noticeBoard);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/notic/:idd", async (req, res) => {
  try {
    const id = req.params.idd;
    const noticeBoard = await Notice.find(id);
    res.send(noticeBoard);
  } catch (error) {
    res.status(404).send(error);
  }
});
app.delete("/notic/:idd", async (req, res) => {
  try {
    const id = req.params.idd;
    const noticeBoard = await Notice.find;
    res.send(noticeBoard);
  } catch (error) {
    res.status(404).send(error);
  }
});

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
        passwordsignup_confirm: req.body.passwordsignup_confirm,
      });

      // console.log("the success part  in the post register" + registerStudent);

      const token = await registerStudent.generateAuthToken();
      //console.log("the token part in the post register" + token);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 12300000),
        httpOnly: true,
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
});

app.post("/AdminRegister", async (req, res) => {
  try {
    const password = req.body.passwordsignup;
    const cpassword = req.body.passwordsignup_confirm;

    if (password == cpassword) {
      const registerAdmin = new RegisterAdmin({
        firstsignup: req.body.firstsignup,
        lastsignup: req.body.lastsignup,
        emailsignup: req.body.emailsignup,
        phonesignup: req.body.phonesignup,
        passwordsignup: req.body.passwordsignup,
        passwordsignup_confirm: req.body.passwordsignup_confirm,
      });

      // console.log("the success part  in the post register" + registerStudent);

      const token = await registerAdmin.generateAuthToken();
      //console.log("the token part in the post register" + token);

      res.cookie("Adminjwt", token, {
        expires: new Date(Date.now() + 12300000),
        httpOnly: true,
      });

      const registered = await registerAdmin.save();
      // console.log("the page part " + registered);

      res.status(201).render("addOrEdit", {
        viewTitle: "Insert Student",
      });
    } else {
      res.send("password are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/AdminLogin", async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;

    const usermail = await RegisterAdmin.findOne({
      emailsignup: email,
    });
    if (!usermail) {
        res.json({
          login: "plz enter correct email or password Or sign up again ",
        });
    }
    const isMatch = await bcrypt.compare(password, usermail.passwordsignup);
    

    const token = await usermail.generateAuthToken();
    //console.log("the token part in the post login : " + token);

    res.cookie("Adminjwt", token, {
      expires: new Date(Date.now() + 7230000000),
      httpOnly: true,
    });

    // console.log ("the cookies status in the post login " + req.cookies.jwt);
    if (isMatch) {
      res.status(201).render("addOrEdit", {
        viewTitle: "Insert Student",
      });
    } else {
      res.send("invalid email or password ");
    }
  } catch (error) {
    // res.status(400).send(error);
    console.log(error)
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;

    const usermail = await Register.findOne({
      emailsignup: email,
    });
    if (!password || !email) {
      res.send("plz fill the all field");
    }
    if (!usermail) {
      res.json({
        login: "plz enter the correct email or password Or sign up again ",
      });
      // res.json({
      //    login:"plz enter the correct email or password"
      // })
    }

    const isMatch = await bcrypt.compare(password, usermail.passwordsignup);

    const token = await usermail.generateAuthToken();
    // console.log("the token part in the post login : " + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 7230000000),
      httpOnly: true,
    });

    // console.log("the cookies status in the post login " + req.cookies.jwt);
    // console.log(isMatch);
    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid email or password ");
    }
  } catch (error) {
    console.log(error);
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
    });

    const registered = await registerContact.save();
    //console.log("the page part " + registered);

    res
      .status(201)
      .send(
        "hello!!<br> " +
          "<strong><br>" +
          registered.name +
          "</strong><br>" +
          "Contact form successfully submitted"
      );
  } catch (error) {
    res.status(401).send(error);
  }
});

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/home", auth, async (req, res) => {
  res.render("index");
});
app.get("/Logout", auth, async (req, res, next) => {
  try {
    console.log("Logged Out");
    // console.log(req.user);
    await res.clearCookie("jwt");
    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token != req.token;
    });

    // delete from database

    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/AdminLogout", Adminauth, async (req, res, next) => {
    try {
    //   console.log('====================================')
    //   console.log("admin logout success");
    //   console.log('====================================')
      console.log(req.Adminuser);
      await res.clearCookie("Adminjwt");
      req.Adminuser.tokens = req.Adminuser.tokens.filter((currElement) => {
        return currElement.token != req.token;
      });
  
      // delete from database
      await req.Adminuser.save();
      res.render("AdminLogin");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

app.get("/About", auth, (req, res) => {
  res.render("About");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/ContactUs", auth, (req, res) => {
  res.render("ContactUs");
});

app.get("/Branch", auth, (req, res) => {
  res.render("Branch");
});
app.get("/Electronics", auth, (req, res) => {
  res.render("Electronics");
});
app.get("/Civil", auth, (req, res) => {
  res.render("Civil");
});
app.get("/Mechanical", auth, (req, res) => {
  res.render("Mechanical");
});
app.get("/IC", auth, (req, res) => {
  res.render("IC");
});
app.get("/Plastic", auth, (req, res) => {
  res.render("Plastic");
});
app.get("/Electrical", auth, (req, res) => {
  res.render("Electrical");
});

//teacher dashboard here

app.get("/AdminLogin", (req, res) => {
  res.render("AdminLogin");
});

app.get("/AdminRegister", (req, res) => {
  res.render("AdminRegister");
});

app.get("/Student", Adminauth, async (req, res) => {
  // console.log('insert table');
  res.render("addOrEdit", {
    viewTitle: "Insert Student",
  });
});
app.post("/Student", Adminauth, (req, res) => {
  // console.log(req.body);
  console.log("submitted form");
  if (req.body._id == "") insertRecord(req, res);
  else updateRecord(req, res);
});

function insertRecord(req, res) {
  // console.log('inside schema');
  var student = new Student();
  student.Rn = req.body.Rn;
  student.name = req.body.name;
  student.branch = req.body.branch;
  student.semester = req.body.semester;
  student.email = req.body.email;
  student.phone = req.body.phone;
  student.city = req.body.city;
  student.save((err, doc) => {
    if (!err) res.redirect("list");
    else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("addOrEdit", {
          viewTitle: "Insert Student",
          Student: req.body,
        });
      } else console.log("Error during record insertion : " + err);
    }
  });
  // console.log(student.name);
}

function updateRecord(req, res) {
  Student.findOneAndUpdate(
    {
      _id: req.body._id,
    },
    req.body,
    {
      new: true,
    },
    (err, doc) => {
      if (!err) {
        res.redirect("list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("addOrEdit", {
            viewTitle: "Update Student",
            Student: req.body,
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

app.get("/list", (req, res) => {
  Student.find((err, docs) => {
    if (!err) {
      res.render("list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving Student list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

app.get("/:id", (req, res) => {
  Student.findById(req.params.id, (err, doc) => {
    // console.log(doc.name);
    // console.log(doc.branch);
    // console.log(doc.semester);
    if (!err) {
      res.render("addOrEdit", {
        viewTitle: "Update Student",
        student: doc,
      });
    } else {
      res.render("list");
    }
  });
});

app.get("/delete/:id", (req, res) => {
  Student.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.render("addOrEdit");
    } else {
      console.log("Error in Student delete :" + err);
    }
  });
});

app.get("*", (req, res) => {
  res.end("404 errror page");
});
app.listen(port, () => {
  console.log("server on");
});
