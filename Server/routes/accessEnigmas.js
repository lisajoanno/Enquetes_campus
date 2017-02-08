/**
 * Created by lisa on 09/01/17.
 */

var express = require('express');
var router = express.Router();

var enigmasDB = require('./../db/enigmasDB');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var result = enigmasDB.findAllEnigmas(function (result)  {
        res.send(result);
    });
});

/* GET home page. */
router.get('/new', function(req, res, next) {
    console.log('là');
    res.render('addEnigma', {});
});

module.exports = router;