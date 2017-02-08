var express = require('express');
var router = express.Router();
var multer  = require("multer");

var storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

router.post('/', upload.array('file'), function(req, res) {
    console.log(req.files);
    res.send("HTTP OK");
});

module.exports = router;