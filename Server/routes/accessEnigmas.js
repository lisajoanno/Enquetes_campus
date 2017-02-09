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
    res.render('addEnigma', {});
});

/*
PAS D'ID

 "titre" : "L'énigme du sphinx",
 "coo" : {
 lat: 43.6210156491945,
 lng: 7.066354751586914
 },
 "image": "sphinx.png",
 "point" : 10,
 "contenu" : "Qu'est ce qui le matin marche à quatre pattes, le midi à deux et le soir à trois ?"

 */
router.post('/new', function(req, res) {
    enigmasDB.getNewId(function (newID) {
        var enigmaToAdd = {};
        enigmaToAdd.id = newID;
        enigmaToAdd.titre = req.body.titre;
        enigmaToAdd.coo = req.body.coo;
        enigmaToAdd.image = req.body.image;
        enigmaToAdd.point = req.body.point;
        enigmaToAdd.contenu = req.body.contenu;
        enigmasDB.addNewEnigma(enigmaToAdd, function (err) {
            if (err) res.send("A problem occured while uploading your enigma");
            else res.send("Your enigma was successfully registered.")
        });
    })
});

module.exports = router;