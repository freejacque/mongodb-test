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

    //
    var doFind = function(callback) {
      collection.find().toArray(function (err, documents) {
        console.dir(documents);
        callback();
      });
    };

    var doInsert = function(i) {
      if(i < 20) {
        var value = Math.floor(Math.random() * 10);
        collection.insert(
          {'n': '#' + i, 'v': value},
          function(err, count) {
            doInsert(i + 1);
          });
      } else {
        console.log();
        console.log('Inserted', i, 'documents:');
        doFind(function() {
          doUpdate();
        });
      }
    };



    // first param is the filter, in this case an empty object
    // this will cause all documents in the collection to be updated
    collection.update({}, {'$set': {'age': 24}}, {'multi': true}, function(err, count) {

      console.log('Updated', count, 'documents');

      collection.find().toArray(function(err, documents) {
        console.dir(documents);
        connection.close();
      });

    });

  });
