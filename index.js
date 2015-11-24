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

    collection.update({}, {'$set': {'age': 24}}, function(err, count) {

      console.log('Updated', count, 'documents');

      collection.find().toArray(function(err, documents) {
        console.dir(documents);
        connection.close();
      });

    });
    // use the insert method from the customers collection
    collection.insert({'name': 'Jane Doe'}, function(err, count) {
      collection.find().toArray(function(err, documents) {
        console.dir(documents);
        connection.close();
      });

    });

  });
