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
            "titre" : "Un jeu vraiment trop fun !",
            "coo" : {
                lat: 43.6210156491945,
                lng: 7.066354751586914
            },
            "image": "enigmas-pics/enigma-1.jpg",
            "point" : 10,
            "contenu" : "A quel endroit correspond cette image ?"
        },
        {
            "id": 2,
            "titre" : "L'énigme du sphinx",
            "coo" : {
                lat: 43.61910809278851,
                lng: 7.0741868019104
            },
            "image": "pics/sphinx.jpg",
            "point" : 20,
            "contenu" : "Qu'est ce qui le matin marche à quatre pattes, le midi à deux et le soir à trois ?"
        },
        {
            "id": 3,
            "titre" : "Le retour du jeu vraiment super fun",
            "coo" : {
                lat: 43.61879740985583,
                lng: 7.062127590179443
            },
            "image": "enigmas-pics/enigma-3.jpg",
            "point" : 15,
            "contenu" : "A quel endroit correspond cette image ?"
        },
        {
            "id": 4,
            "titre" : "La seconde enigme du sphinx",
            "coo" : {
                lat: 43.62497969832218,
                lng: 7.073543071746826
            },
            "image": "pics/sphinx.jpg",
            "point" : 40,
            "contenu" : "La première engendre la seconde et la seconde engendre la première."
        }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(4, result.result.n);
        assert.equal(4, result.ops.length);
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

