/**
 * Created by Lisa Joanno on 16/01/17.
 */

var express = require('express');
var router = express.Router();

var validationDB = require('./validationDB');

/**
 * ATTENTION Content-type : application/json
 *
 * Lit la première attente de validation de la DB et l*'affiche
 */

router.get('/', function(req, res, next) {
    validationDB.getLastValidation(function (result) {
        if (result == null) {
            res.render('gameMaster', { title: 'Pas de nouvelle réponse proposée'});
        } else {
            res.render('gameMaster', { title: 'Nouvelle réponse proposée', result : result.result, id : result._id , team : result.teamID, enigma: result.enigmaID, answer: result.answer});
        }
    });
});

router.get('/all', function (req,res, next) {
    //console.log("salut");
    validationDB.getAllValidation(function (item) {
        //console.log(item);
        res.send(item);
    });
});

/**
 *
 * Nouvelle attente de formulation envoyée en DB
 *
 *
 */
router.post('/', function(req, res) {
    //res.send("En attente de validation par le MDJ");

    validationDB.addAValidation(req.body, function () {
        console.log("bien envoyé en BD : " + req.body.enigmasID + "");

        res.send(true); // TODO à faire !!
        // attendre

    });
});

module.exports = router;


/**
 * Set que la réponse proposée (body : _id) est valide en DB
 */
router.post('/isValid', function (req,res) {
    validationDB.setValid(req.body.idAnswer, function () {
        //TODO
    })
});

/**
 * Set que la réponse proposée (body : _id) n'est pas valide en DB
 */
router.post('/isNotValid', function (req,res) {
    validationDB.setNotValid(req.body.idAnswer, function () {
        //TODO
    })
});
