/**
 * Created by lisa on 09/01/17.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');


// Connection URL
var url = 'mongodb://localhost:27017/enigmas';


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    // TODO commenter pour vider la bdd de temps en temps
    db.collection('documents').drop();
    assert.equal(null, err);
    console.log("Connected successfully to enigmas");

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
            "id": 1,
            "lat": 44.460970,
            "lng": 4.746094,
            "image": "image.png",
            "point" : 10
        },
        {
            "id": 2,
            "lat": 45.678,
            "lng": 3.746094,
            "image": "image.png",
            "point" : 20
        },
        {
            "id": 3,
            "lat": 48.460,
            "lng": 5.76094,
            "image": "image.png",
            "point" : 15
        }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 enigmas into the collection");
        callback(result);
    });
};

/**
 * Browses all the content of a db in parameters.
 * @param db the DB to browse
 * @param callback what to do with the result.
 */
var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res = JSON.stringify(docs, null, 2);
        //console.log("T : "+res);
        callback(res);
    });


};

/**
 * Finds all enigmas.
 *
 * @param callback what to do with the result.
 */
var findAllEnigmas = function(callback) {

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to enigmas");
        findDocuments(db, function(res) {
            db.close();
            callback(res);
        });
    });
};

module.exports = findAllEnigmas;
