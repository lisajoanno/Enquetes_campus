/**
 * Created by lisa on 09/01/17.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var mongodb = require('mongodb');

// Connection URL
var url = 'mongodb://localhost:27017/team';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    // TODO commenter pour vider la bdd de temps en temps
    db.collection('documents').drop();
    assert.equal(null, err);
    console.log("Connected successfully to teams");

    insertDocuments(db, function() {
        db.close();
    });
});

// Initialization
var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
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
};


exports.addATeam = function (teamName, callback) {
    MongoClient.connect(url, function(err, db) {
        // Get the documents collection
        var collection = db.collection('documents');
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
            console.log("l'id de la team " + teamName + " est : " + item._id);
            callback(item._id);
        });
    });
};

/**
 * Renvoie l'intégralité de la DBB des teams
 * @param callback
 */
exports.getAllTeams = function (callback) {
    MongoClient.connect(url, function(err, db) {
        // Get the documents collection
        var collection = db.collection('documents');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            res = JSON.stringify(docs, null, 2);
            //console.log("T : "+res);
            callback(res);
        });
    });
};



exports.teamResolvedAnEnigma = function (idTeam, idEnigma, callback) {
    console.log("la team " + idTeam + "  a validé l'enigme " + idEnigma);
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('documents');
        collection.findOne({'teamName': idTeam}, function(err, item) {
            var nowResolved = item.resolved + "," + idEnigma;
            assert.equal(err, null);
            collection.updateOne(
                {'teamName': idTeam },
                { $set: { "resolved" : nowResolved }}
            );
        });

    });
};