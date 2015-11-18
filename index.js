'use strict';

//  require MangoClient class from the mongodb library
var MongoClient = require('mongodb').MongoClient;

//  the connect method is from the MongoClient class
//  the connection is bing made on port 27017
MongoClient.connect(
  'mongodb://127.0.0.1:27017/accounting',
  function(err, connection) {
    var collection = connection.connection('customers');

    collection.insert({'name': 'Jane Doe'}, function(err, count) {

      collection.find().toArray(function(err, documents) {
        console.dir(documents);
        connection.close();
      });

    });

  });
