/**
 * Created by Lisa Joanno on 31/01/17.
 */

var MongoClient = require('mongodb').MongoClient;
var url = require('./dbConfig').url;
// the one and only
var database;

/**
 * Connect creates the database.
 *
 * @type {{getDatabase: module.exports.getDatabase, connect: module.exports.connect}}
 */
module.exports = {
    getDatabase: function() {
        return database;
    },
    connect: function (callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                return console.log(err);
            }
            database = db;
            console.log("Connected successfully to MongoDB.");

            callback();
        });
    }
};

