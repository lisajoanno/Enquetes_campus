var express = require('express');
var router = express.Router();
var multer  = require("multer");

var storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});

var upload = multer({ storage: storage });

router.post('/', upload.array('file'), function(req, res) {
    console.log("jai recu qqchose");
    console.log(req.files);
    // don't forget to delete all req.files when done
    res.send("HTTP OK");
});

module.exports = router;