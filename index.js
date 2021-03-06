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
      //  only documents with v = 5 will be located and printed
      collection.find(
        // having multiple filters is an AND query
        {
          'v': {'$lt': 8 },
          'valuable': true
        }
        ).toArray(function (err, documents) {
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


// this is an example of an OR query
  collection.find(
    {
      '$or': [
        {'v': 5},
        {'v': 8}
      ]
    }
  ).toArray(function (err, documents) {...})

// this is an example of an AND & OR query
// retrieve all values > 3 AND with n = #5 or n = #10
  collection.find({
    'v': {'$gt': 3},
    '$or': [
      {'n': '#5'},
      {'n': '#10'}
    ]
  }).toArray(function (err, documents) {})

// use regex for the n attribute because it holds a string value
// matches all docs that has n value starting with #1
  collection.find({
    {
      'n': /^#1/
    }
  }).toArray(function (err, documents) {})

  // the find method can take an options parameter: limit, skip & sort
  //  retrieves five docs whose n value start withs #1, skips the first two matches
  //  then sorts the resulting set by v value
  collection.find(
    {
      'n': /^#1/
    },
    {
      'limit': 5,
      'skip' : 2,
      'sort' : 'v'
    }
  ). toArray(function (err, documents) {})

    // this sort matches docs by v value in ascending order, docs with the same
    // v are then ordered by n value in descending order
      'sort' : [['v', 'asc'], ['n', 'desc']]

      // set v to 5 for docs with n strating with #1
      //  this is a regularly used update operation
      collection.update(
        {'n': /^#1/},
        {'$set': {'v': 5}},
        {'multi': true},
        function(err, count) {
          // ...
        }
      )
      // numeric attributes can be increased
      // there is no $dec operation increase by -1 instead
      collection.update(
        {'n': /^#1/},
        {'$inc': {'v': +1}},
        {'multi': true},
        function(err, count) {
          // ...
      })

      // update with multiplication
      collection.update(
        {'n': /^#1/},
        {'$mul': {'v': 2}},
        {'multi': true},
        function(err, count) {
          // ...
        }
      )

    // other operators:
    // $rename - renames a field
    // $unset - removes a specified field
    // $min - only updates the field if the specified value < the present value
    // $max - only updates the field if the specified value > the present value
    // $currentDate - sets the value of the field to the current date


    // if the filter matches any existing docs the update will be performed
    //  if not, a new doc is inserted
    collection.update(
      {'n': '#20'},
      {'$set': {'n': '20', 'v': 1}},
      {'multi': true, 'upsert': true},
      function(err, count) {
        // ...
      }
    )
