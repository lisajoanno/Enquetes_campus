/**
 * Created by Lisa Joanno on 26/01/17.
 */

/**
 * Created by lisa on 09/01/17.
 */

var express = require('express');
var router = express.Router();

var teamDB = require('./teamDB');

/**
 *
 * Nouvelle attente de formulation envoyée en DB
 *  ATTTENTTTTIIIOOOON application/json
 *
 */
router.post('/', function(req, res) {
    //console.log("reçu : "+ req.body);
    var teamName = req.body.teamName;
    //console.log("Nouvelle team : " + teamName);
    teamDB.addATeam(teamName, function (idTeamCreated) {
        res.send(idTeamCreated)
    });
});


router.get('/all', function (req,res, next) {
    //console.log("salut");
    teamDB.getAllTeams(function (item) {
        res.send(item);
    });
});



module.exports = router;