// jshint node: true
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mongoose-crud');
const db = mongoose.connection;

const Person = require('./models/person.js');

const done = function() {
  db.close();
};

const create = function(givenName, surname, dob, gender) {
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

const index = function() {
  Person.find().then(function(people) {
    people.forEach(function(person) {
      console.log(person.toJSON());
    });
  }).catch(console.error).then(done);
};

const destroy = function(id) {
  Person.findById(id).then(function(person) {
    return person.remove();
  }).catch(console.error
  ).then(done);
};

const read = function(field, criterion) {
  let search = {};
  if (criterion[0] === '/') {
    let regex = new RegExp(criterion.slice(1, criterion.length - 1));
    search[field] = regex;
  } else {
    search[field] = criterion;
  }

  Person.find(search).then(function(people) {
    people.forEach(function(person) {
      console.log(person.toObject());
    });
  }).catch(console.error
  ).then(done);
};

const update = function(id, field, value) {
  let modify = {};
  modify[field] = value;
  Person.findByIdAndUpdate(id, { $set: modify }, { new: true }).then(function(person) {
    console.log(person.toJSON());
  }).catch(console.error
  ).then(done);
};

db.once('open', function() {
  let command = process.argv[2];

  // Using more than once, avoiding jshint complaints
  let field;
  let id;

  switch (command) {
    case 'c':
      let givenName = process.argv[3];
      let surname = process.argv[4];
      let dob =  process.argv[5];
      let gender =  process.argv[6];
      if (true || givenName) {
        create(givenName, surname, dob, gender);
      } else {
        console.log('usage c <given_name> <surname> <date of birth> [gender]');
        done();
      }
      break;

    case 'r':
      field  = process.argv[3];
      let criterion = process.argv[4];
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
      let value = process.argv[5];
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
