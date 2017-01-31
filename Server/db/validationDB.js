/**
 * Created by Lisa Joanno on 16/01/17.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var objectId = require('mongodb').ObjectID;
var mongodb = require('mongodb');

var teamDB = require('./teamDB');
var enigmaDB = require('./enigmasDB');

// Connection URL
var url = require('./dbConfig').url;
var collectionName = 'validations';

var mongo = require('./connection');

exports.init = function () {
    console.log("j'initie validation");
    var db = mongo.getDatabase();
    db.collection(collectionName).drop();
};

/**
 * Initialisation de la BDD
 */
/**
MongoClient.connect(url, function(err, db) {
    db.collection(collectionName).drop();
    assert.equal(null, err);
    console.log("Connected successfully to " + collectionName);
    insertStartingDocuments(db, function() {
        db.close();
    });
});
 **/

/**
 * Insère quelques documents dans la BDD pour l'initialiser
 *
 * @param db
 * @param callback
 */
/**var insertStartingDocuments = function(db, callback) {
    // Get the documents collection

    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany([
        {
            "enigmaID": 1,
            "teamID" : "588f4c54370d641cb0e19fa1",
            "answer" : "le temps",
            "result" : "",
            "socketId" : 111
        },{
            "enigmaID":3,
            "teamID" : 2,
            "answer" : "le temps 2",
            "result" : "",
            "socketId" : 222
        },{
            "enigmaID":2,
            "teamID" : 7,
            "answer" : "le temps 3",
            "result" : "",
            "socketId" : 333
        }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(0, result.result.n);
        assert.equal(0, result.ops.length);
        console.log("La BDD a été initialisée avec " + result.result.n + " validation(s).");
        callback(result);
    });
};**/

/**
 * Ajoute le json en param dans la DB des validations
 * @param json
 * @param callback
 */
exports.addAValidation = function (json, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany([
        json
    ]);
    callback();
};

/**
 * Renvoie la première validation pour le game master
 * @param db
 * @param callback
 */
var getAValidation = function(callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Find some documents
    collection.findOne({"result":""}, function(err, item) {
        assert.equal(err, null);
        callback(item);
    });
};

/**
 * Renvoie l'intégralité de la DBB des validations
 * @param callback
 */
exports.getAllValidation = function (callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res = JSON.stringify(docs, null, 2);
        callback(res);
    });
};

/**
 * Demande de la denière validation de la DB des validations de réponses en attente.
 * @param callback
 */
exports.getLastValidation = function (callback) {
    getAValidation(function(res) {
        callback(res);
    });
};


exports.setValid = function (id, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    collection.updateOne(
        {'_id': mongodb.ObjectID(id) },
        { $set: { "result" : "ok" }}
    );
    collection.find({'_id': mongodb.ObjectID(id) }).toArray(function(err, docs) {
        assert.equal(err, null);

        /*
        on va chercher le score que rapport l'énigme
         */
        enigmaDB.getScoreForAEnigma(docs[0].enigmaID, function (scoreFound) {
            teamDB.teamResolvedAnEnigma(docs[0].teamID, docs[0].enigmaID, scoreFound , function () {
                sendToClient(id, "ok", callback);
                callback();
            });
        });
    });
};


exports.setNotValid = function (id, callback) {
    var db = mongo.getDatabase();
    var collection = db.collection(collectionName);
    collection.updateOne(
        {'_id': mongodb.ObjectID(id) },
        { $set: { "result" : "nok" }}
    );
    callback();

    sendToClient(id, "nok", callback);
};


// ----------------------                       socket related

// La liste des sockets des clients (appelé dans app.js à chaque fois qu'une nouvelle socket est créée)
var clients = {};
exports.setSockets = function(listSocket) {
    clients = listSocket;
};

/**
 * Envoie le message toSend au client, en cherchant l'id de sa socket en BDD à partir de l'ID de la réponse donnée.
 * @param id
 * @param toSend
 * @param callback
 */
var sendToClient = function(id, toSend, callback) {
    var socketId;
    // ICI faire socket avec l'ID de la socket en BD pour l'_id
    // MongoClient.connect(url, function(err, db) {
        // Get the documents collection
        var collection = db.collection(collectionName);
        collection.find({'_id': mongodb.ObjectID(id) }).toArray(function(err, docs) {
            assert.equal(err, null);
            if (clients[docs[0].socketId] != null) {
                clients[docs[0].socketId].emit('isvalidated', toSend);
            }
            callback();
        });
    // });
};


