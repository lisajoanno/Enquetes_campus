/**
 * Created by Lisa Joanno on 31/01/17.
 */

var MongoClient = require('mongodb').MongoClient;
var database = require('./database');
MongoClient.connect(url, function (err, db) {
    if (err) {
        return console.log(err);
    }
    database.
    assert.equal(null, err);
    console.log("Connected successfully to "+collectionName);

});