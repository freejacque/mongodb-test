'use strict';

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(
  'mongodb://127.0.0.1:27017/accounting',
  function(err, connection) {
    var collection = connection.collection('customers');

    //  of files with a v > 5, skips the first 100,000 files and then lists 10, sorted by v
    collection.find(
      {'v': {'$gt': 5}},
      {
        'skip': 100000,
        'limit': 10,
        'sort': 'v'
      }
    ).toArray(function(err, documents) {
        console.dir(documents);
        connection.close();
    });

  });




