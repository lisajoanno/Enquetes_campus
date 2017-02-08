/**
 * Created by Lisa Joanno on 09/01/17.
 */
var assert = require('assert');
var collectionName = 'enigmas';
var mongo = require('./connection');


/**
 * Initialization of some documents.
  */
function insertDocuments() {
    // Get the documents collection
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany([
        {
            "id": 1,
            "titre" : "L'énigme du sphinx",
            "coo" : {
                lat: 43.6210156491945,
                lng: 7.066354751586914
            },
            "image": "pics/sphinx.png",
            "point" : 10,
            "contenu" : "Qu'est ce qui le matin marche à quatre pattes, le midi à deux et le soir à trois ?"
        },
        {
            "id": 2,
            "titre" : "L'énigme du sphinx : le retour",
            "coo" : {
                lat: 43.61910809278851,
                lng: 7.0741868019104
            },
            "image": "pics/sphinx.png",
            "point" : 20,
            "contenu" : "La première engendre la seconde et la seconde engendre la première."
        },
        {
            "id": 3,
            "titre" : "Mène l'enquête !",
            "coo" : {
                lat: 43.614893,
                lng: 7.07158
            },
            "image": "enigmas-pics/enigma-3.jpg",
            "point" : 10,
            "contenu" : "A quel endroit correspond cette image ?"
        },
        {
            "id": 4,
            "titre" : "La pause au Learning Centre !",
            "coo" : {
                lat: 43.614893,
                lng: 7.07158
            },
            "image": "enigmas-pics/enigma-4.jpg",
            "point" : 20,
            "contenu" : "La première engendre la seconde et la seconde engendre la première."
        },
        {
            "id": 5,
            "titre" : "Seuls les vrais sauront me retrouver...",
            "coo": {
                lat: 43.614893,
                lng: 7.07158
            },
            "image": "enigmas-pics/enigma-5.jpg",
            "point": 40,
            "contenu" : "A quel endroit correspond cette image ?"
        }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(result.result.n, result.ops.length);
        console.log("Inserted " + result.result.n+ " enigmas into the collection");
    });
};

/**
 * Drop and init.
 */
exports.init = function () {
    var db = mongo.getDatabase();
    db.collection(collectionName).drop();
    insertDocuments();
};


/**
 * Browses all the content of a db in parameters.
 * @param db the DB to browse
 * @param callback what to do with the result.
 */
var findDocuments = function(db, callback) {
    var collection = db.collection(collectionName);
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res = JSON.stringify(docs, null, 2);
        callback(res);
    });
};




/**
 * Finds all enigmas.
 *
 * @param callback what to do with the result.
 */
exports.findAllEnigmas = function(callback) {
    var db = mongo.getDatabase();
    findDocuments(db, function(res) {
        callback(res);
    });
};


/**
 * Returns the score for a given enigma designated by its id (example : 3).
 *
 * @param idEnigma
 * @param callback
 */
exports.getScoreForAEnigma = function(idEnigma, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    var valueOfEnigmaID = parseInt(idEnigma);
    collection.find({"id" : valueOfEnigmaID})
        .toArray(function(err, docs) {
            callback(docs[0].point);
        });
};

exports.getNewId = function(callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    var newID = 0;
    collection.find({}).sort({id:-1}).limit(1).toArray(function (err, items) {
        var item = items[0];
        newID = item.id + 1;
        callback(newID);
    });
};

exports.addNewEnigma = function(enigmaToAdd, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany([
        enigmaToAdd
    ],
        callback() //TODO peut etre des problemes ici?
    );

};