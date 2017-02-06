/**
 * Created by lisa on 09/01/17.
 */
var assert = require('assert');
var mongodb = require('mongodb');

// Connection URL
var url = require('./dbConfig').url;
var collectionName = 'teams';
var mongo = require('./connection');

/**
 * Drop and init.
 */
exports.init = function () {
    var db = mongo.getDatabase();
    db.collection(collectionName).drop();
};


exports.addATeam = function (teamName, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Insert some documents
    collection.insert([
        {
            "teamName": teamName,
            "resolved": "",
            "score": 0
        }
    ], function(err,docsInserted){
        console.log(docsInserted);
        callback(docsInserted._id);
    });

};



/**
 * Renvoie l'intégralité de la DBB des teams
 * @param callback
 */
exports.getAllTeams = function (callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res = JSON.stringify(docs, null, 2);
        //console.log("T : "+res);
        callback(res);
    });
};



exports.teamResolvedAnEnigma = function (idTeam, idEnigma, score, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    collection.find({'_id': mongodb.ObjectID(idTeam) })
        .toArray(function(err, docs) {
            assert.equal(err, null);
            var nowResolved = docs[0].resolved + "," + idEnigma;
            collection.updateOne(
                {'_id': mongodb.ObjectID(idTeam) },
                { $set: { "resolved" : nowResolved },
                    $inc: { "score" : score} // incrémentation du score
                }
            );
        });
    callback();
};
