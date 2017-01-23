/**
 * Created by Lisa Joanno on 16/01/17.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');


// Connection URL
var url = 'mongodb://localhost:27017/validation';


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    // TODO commenter pour vider la bdd de temps en temps
    db.collection('documents').drop();
    assert.equal(null, err);
    console.log("Connected successfully to validation");

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
            "enigmaID":1,
            "teamID" : 4,
            "answer" : "le temps",
            "result" : ""
        },{
            "enigmaID":3,
            "teamID" : 2,
            "answer" : "le temps 2",
            "result" : ""
        },{
            "enigmaID":2,
            "teamID" : 7,
            "answer" : "le temps 3",
            "result" : ""
        }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 1 validations into the collection");
        callback(result);
    });
};

/**
 * Ajouter le json en param dans la DB (à la fin, FIFO).
 * @param json
 * @param callback
 */
exports.addAValidation = function (json, callback) {

    MongoClient.connect(url, function(err, db) {

        // Get the documents collection
        var collection = db.collection('documents');
        // Insert some documents
        collection.insertMany([
            json
        ]);
        callback();

    });


};

var getValidations = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.findOne({}, function(err, item) {
        assert.equal(err, null);
        callback(item);
    });
};

exports.getAllValidation = function (callback) {
    //callback("salut");
    // Get the documents collection
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

/**
 * Demande de la denière validation de la DB des validations de réponses en attente.
 * @param callback
 */
exports.getLastValidation = function (callback) {
    console.log("On demande une validation");
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        getValidations(db, function(res) {
            db.close();
            callback(res);
        });
    });
};


var objectId = require('mongodb').ObjectID;
var mongodb = require('mongodb');


exports.setValid = function (id, callback) {
    console.log("on écrit en BD que " + id + " est valide");

    MongoClient.connect(url, function(err, db) {
        // Get the documents collection
        var collection = db.collection('documents');
        collection.updateOne(
            {'_id': mongodb.ObjectID(id) },
            { $set: { "result" : "ok" }}
        );
        callback();
    });
};

exports.setNotValid = function (id, callback) {
    console.log("on écrit en BD que " + id + " n'est pas valide");

    MongoClient.connect(url, function(err, db) {
        // Get the documents collection
        var collection = db.collection('documents');
        collection.updateOne(
            {'_id': mongodb.ObjectID(id) },
            { $set: { "result" : "nok" }}
        );
        callback();
    });
};