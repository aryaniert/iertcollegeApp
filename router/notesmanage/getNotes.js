const express = require('express');
const async = require('hbs/lib/async');
const router = express.Router();
const multer = require("multer");
const File = require("../../models/fileNotes");



router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })



//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

// Multer Filter
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf") {
      cb(null, true);
    } else {
      cb(new Error("Not a PDF File!!"), false);
    }
  };

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

// Single file
router.post("/single",  upload.single("myFile"), async(req, res) => {
//   console.log(req.file)
try {
    const newFile = await File.create({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
})

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })

module.exports = router;