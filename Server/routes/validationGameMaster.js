/**
 * Created by Lisa Joanno on 16/01/17.
 */

var express = require('express');
var router = express.Router();
var validationDB = require('./../db/validationDB');



/**
 * ATTENTION Content-type : application/json
 *
 * Returns an awaiting validation (FIFO).
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

/**
 * Returns all validations, waiting or not.
 */
router.get('/all', function (req,res, next) {
    validationDB.getAllValidation(function (item) {
        res.send(item);
    });
});



/**
 *
 * POST a new awaiting validation.
 * EXAMPLE :
 *
 *
 * teamID : 5890cc58764cef34815f9502
 * enigmaID : 3
 * answer : life and death
 *
 *
 */
router.post('/', function(req, res) {
    validationDB.addAValidation(req.body, function () {
        res.send(true); // TODO du coup, changer ? @Chloé
    });
});



/**
 * The validation designated by req (Example : 5890cc58764cef34815f9502) is validated in database.
 */
router.post('/isValid', function (req, res) {
    validationDB.setValid(req.body.idAnswer, function () {

    })
});



/**
 * The validation designated by req (Example : 5890cc58764cef34815f9502) is NOT validated in database.
 */
router.post('/isNotValid', function (req,res) {
    validationDB.setNotValid(req.body.idAnswer, function () {

    })
});



module.exports = router;
