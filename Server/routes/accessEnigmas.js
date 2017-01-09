/**
 * Created by lisa on 09/01/17.
 */

var express = require('express');
var router = express.Router();

var enigmasDB = require('./enigmasDB');

/* GET home page. */
router.get('/', function(req, res, next) {
    var result = enigmasDB(function (result)  {
        res.render('enigmas', { title: 'Enigmas :', enigmasList: result});
    });
});

module.exports = router;
