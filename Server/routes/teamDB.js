/**
 * Created by lisa on 09/01/17.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

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
            "resolved": "1,2,3",
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

