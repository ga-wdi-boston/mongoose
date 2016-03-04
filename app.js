// jshint node: true
'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mongoose-crud');
var db = mongoose.connection;

var Person = require('./models/person.js');

var done = function() {
  db.close();
};

var create = function(givenName, surname, dob, gender) {
  Person.create({
    'name.given': givenName,
    'name.surname': surname,
    dob: dob,
    gender: gender,
  }).then(function(person) {
    console.log(person);
  }).catch(function(error) {
    console.error(error);
  }).then(done);
};

var index = function() {
  Person.find().exec().then(function(people) {
    people.forEach(function(person) {
      console.log(person.toJSON());
    });
  }).catch(console.error).then(done);
};

var destroy = function(id) {
  Person.findById(id).exec().then(function(person) {
    return person.remove();
  }).catch(console.error
  ).then(done);
};

var read = function(field, criterion) {
  var search = {};
  if (criterion[0] === '/') {
    var regex = new RegExp(criterion.slice(1, criterion.length - 1));
    search[field] = regex;
  } else {
    search[field] = criterion;
  }

  Person.find(search).exec().then(function(people) {
    people.forEach(function(person) {
      console.log(person.toObject());
    });
  }).catch(console.error
  ).then(done);
};

var update = function(id, field, value) {
  var modify = {};
  modify[field] = value;
  Person.findByIdAndUpdate(id, { $set: modify }, { new: true }).exec().then(function(person) {
    console.log(person.toJSON());
  }).catch(console.error
  ).then(done);
};

db.once('open', function() {
  var command = process.argv[2];

  // Using more than once, avoiding jshint complaints
  var field;
  var id;

  switch (command) {
    case 'c':
      var givenName = process.argv[3];
      var surname = process.argv[4];
      var dob =  process.argv[5];
      var gender =  process.argv[6];
      if (true || givenName) {
        create(givenName, surname, dob, gender);
      } else {
        console.log('usage c <given_name> <surname> <date of birth> [gender]');
        done();
      }

    break;
    case 'r':
      field  = process.argv[3];
      var criterion = process.argv[4];
      if (!criterion) {
        console.log('usage: r <field> <criterion>');
        done();
      } else {
        read(field, criterion);
      }

    break;
    case 'u':
      id = process.argv[3];
      field = process.argv[4];
      var value = process.argv[5];
      update(id, field, value);
    break;
    case 'd':
      id = process.argv[3];
      destroy(id);
    break;
    default:
      index();
    break;
  }

});
