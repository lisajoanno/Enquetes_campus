/**
 * Created by lisa on 09/01/17.
 */
var assert = require('assert');
var mongodb = require('mongodb');

// Connection URL
var url = require('./dbConfig').url;
var collectionName = 'teams';

var mongo = require('./connection');
var db = mongo.getDatabase();
//db.collection(collectionName).drop();

// Use connect method to connect to the server
/*MongoClient.connect(url, function(err, db) {
    db.collection(collectionName).drop();
    assert.equal(null, err);
    console.log("Connected successfully to "+ collectionName);

    insertDocuments(db, function() {
        db.close();
    });
});*/


/**
// Initialization
var insertDocuments = function(callback) {
    // Get the documents collection
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany([
        {
            "teamName": "team1",
            "resolved": "1",
            "score": 10
        },
        {
            "teamName": "team2",
            "resolved": "1,2",
            "score": 0
        },
        {
            "teamName": "team3",
            "resolved": "1",
            "score": 20
        }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 teams into the collection");
        callback(result);
    });
};**/

exports.init = function () {
    console.log("j'initie team");
    var db = mongo.getDatabase();
    db.collection(collectionName).drop();
};


exports.addATeam = function (teamName, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany([
        {
            "teamName": teamName,
            "resolved": "",
            "score": 0
        }
    ]);
    collection.findOne({"teamName":teamName}, function(err, item) {
        assert.equal(err, null);
        callback(item._id);
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
            var nowResolved = docs[0].resolved + "," + idEnigma;
            assert.equal(err, null);
            collection.updateOne(
                {'_id': mongodb.ObjectID(idTeam) },
                { $set: { "resolved" : nowResolved },
                    $inc: { "score" : score} // incrémentation du score
                }
            );
        });
};
