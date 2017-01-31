/**
 * Created by lisa on 09/01/17.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var mongodb = require('mongodb');

// Connection URL
var url = 'mongodb://lisa:weblisa@ds137729.mlab.com:37729/web-map-project-si5';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    // TODO commenter pour vider la bdd de temps en temps
    //db.collection('documents').drop();
    //assert.equal(null, err);
    console.log("Connected successfully to teams");

    insertDocuments(db, function() {
        db.close();
    });
});

// Initialization
var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('teams');
    // Insert some documents
    /**collection.insertMany([
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
    });**/
};

exports.addATeam = function (teamName, callback) {
    console.log("je suis dans addateam et " + teamName);
    MongoClient.connect(url, function(err, db) {
        // Get the documents collection
        var collection = db.collection('teams');
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
        var collection = db.collection('teams');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            res = JSON.stringify(docs, null, 2);
            //console.log("T : "+res);
            callback(res);
        });
    });
};

exports.teamResolvedAnEnigma = function (idTeam, idEnigma, score, callback) {
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('teams');
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
        /*, function(err, item) {
            var nowResolved = item.resolved + "," + idEnigma;
            assert.equal(err, null);
            collection.updateOne(
                {'teamName': idTeam },
                { $set: { "resolved" : nowResolved }}
            );
        });*/

    });
};
