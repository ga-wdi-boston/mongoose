var async = require('async');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cats');

var Cat = require('./lib/cats.js');

// we run these under async.series because we were having
// problems where we were searching for cats before the
// database had a chance to finish recording/creating them.

async.series([

    function(done) {

      // Example CREATE - Domino

      Cat.create({
        catName: 'Domino',
        age: 1,
        sex: 'male',
        ownerName: 'Charlton Wilbur'
      }, function(error, cat) {
        // create returns the new cat in a callback

        if (error) {
          console.error(error);
        } else {
          console.log('we created %s', cat.catName);
        }
      });

      done();
    },
    function(done) {

      // second example CREATE

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
      });
      done();
    },
    function(done) {

      // example RETRIEVE
      // find (finds many)

      Cat.find({
        sex: 'male'
      }, {}, function(error, catList) {
        debugger;
        catList.forEach(function(cat) {
          console.log('we found %s', cat.catName);
        });
      });

      done();
    },
    function(done) {

      // example RETRIEVE
      // findOne (finds at most one, no matter how many there are)

      Cat.findOne({
        name: 'Mr. Dickens'
      }, 'catName ownerName', function(error, cat) {
        debugger;
        console.log('we found %s', cat.catName);
      });
      done();
    },
  ],

  function(error, results) {
    if (error) {
      console.error(error);
    }
  });



// cat: {
//   catName: String,
//   catNickname: String,
//   age:  Number,
//   sex:  String,
//   ownerName: String,
// }
