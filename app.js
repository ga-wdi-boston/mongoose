var async = require('async');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cats');

var Cat = require('./lib/cats.js');

// we run these under async.series because we were having
// problems where we were searching for cats before the
// database had a chance to finish recording/creating them.

async.series([

    // Example CREATE - Domino
    function(done) {
      Cat.create({
        catName: 'Domino',
        age: 1,
        sex: 'male',
        ownerName: 'Charlton Wilbur'
      }, function(error, cat) {
        // create returns the new cat in a callbac
        if (error) {
          console.error(error);
        } else {
          console.log('we created %s', cat.catName);
        }

        done();
      });
    },

    // second example CREATE
    function(done) {
      Cat.create({
        catName: 'Mr. Dickens',
        age: 5,
        sex: 'male',
        ownerName: 'James Staub'
      }, function(error, cat) {
        if (error) {
          console.error('Mr Dickens error:' + error);
        } else {
          console.log('we created %s', cat.catName);
        }

        done();
      });
    },

    // example RETRIEVE - find (many)
    function(done) {
      Cat.find({
        sex: 'male'
      }, function(error, catList) {
        catList.forEach(function(cat) {
          console.log('we found %s', cat.catName);
        });
        done();
      });
    },

    // example RETRIEVE
    // findOne (finds at most one, no matter how many there are)
    function(done) {
      Cat.findOne({
        catName: 'Mr. Dickens'
      }, function(error, cat) {
        console.log('we found %s', cat.catName);
        done();
      });
    },

    // example UPDATE - increase Mr. Dickens's age by 1
    function(done) {
      Cat.findOne({
          catName: 'Mr. Dickens'
        },
        function(error, cat) {
          cat.age = cat.age + 1;
          console.log('updated %s', cat.catName);
          done();
        }
      );
    },

    // example UPDATE - Domino changes owners
    function(done) {
      Cat.findOne({
          catName: 'Domino'
        },
        function(error, cat) {
          cat.ownerName = 'Jacob Miller';
          cat.save();
          console.log('updated %s', cat.catName);
          done();
        }
      );
    },

    // example DELETE - Domino's new owners use a different vet
    function(done) {
      Cat.remove({
        catName: 'Domino'
      });
      console.log('removed');
      done();
    },

    // get rid of all the cats so we can run this again next time
    function(done) {
      Cat.remove({});
      console.log('all cats removed');
      done();
    }
  ],

  function(error, results) {
    if (error) {
      console.error(error);
    }

    mongoose.disconnect();
  });
