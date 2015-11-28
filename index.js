'use strict';

//  require MongoClient class from the mongodb library
var MongoClient = require('mongodb').MongoClient;

//  the connect method is from the MongoClient class
//  connect to th accounting db on port 27017
MongoClient.connect(
  'mongodb://127.0.0.1:27017/accounting',
  function(err, connection) {

    // create a collection object that represents the customers
    // collection within the accounting db
    var collection = connection.connection('customers');

    // prints all documents
    var doFind = function(callback) {
      collection.find().toArray(function (err, documents) {
        // .dir() displays an interactive list of the objects properties
        //  this is non-standard & shouldn't be used on web-facing production sites
        console.dir(documents);
        callback();
      });
    };

    // recursive function, inserts 20 docs into the collection
    var doInsert = function(i) {
      if(i < 20) {
        var value = Math.floor(Math.random() * 10);
        collection.insert(
          // n = serial number of the insert operation
          // v = value = random number between 0 and 9
          {'n': '#' + i, 'v': value},
          function(err, count) {
            doInsert(i + 1);
          });
      } else {
        console.log();
        console.log('Inserted', i, 'documents:');
        // after 20 inserts call doFind
        doFind(function() {
          doUpdate();
        });
      }
    };

    // files w/v > 5 will have 'valuable' set to true, all the files are listed
    // then all files are deleted.
    var doUpdate = function() {
      collection.update(
        {'v': {'$gt': 5}},
        {'$set': {'valuable': true}},
        {'multi': true},
        function(err, count) {
          console.log();
          console.log('Updated', count, 'documents:');
          doFind(function() {
            collection.remove({}, function() {
              connection.close();
            });
          });
        });
    };

    doInsert(0);

  });
