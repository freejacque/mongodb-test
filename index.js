'use strict';

var MongoClient = require('mongodb').MongoClient;

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
