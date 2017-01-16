/**
 * Created by lisa on 09/01/17.
 */

var express = require('express');
var router = express.Router();

var enigmasDB = require('./enigmasDB');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //res.setHeader('Content-Type', 'application/json');
    var result = enigmasDB(function (result)  {

        res.send(result);

        //res.render('enigmas', { title: 'Enigmas :', enigmasList: result});

    });
    //res.end();
});

module.exports = router;