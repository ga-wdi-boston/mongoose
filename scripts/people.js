'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mongoose-crud');
const db = mongoose.connection;

const Person = require('../models/person.js');

const mapPerson = require('./mapPerson.js');

const done = function() {
  db.close();
};

const loadPeople = () =>
  new Promise((resolve, reject) => {
    const people = [];
    const fs = require('fs');
    const parse = require('csv').parse;
    const parser = parse({ columns: true });

    const input = fs.createReadStream('data/people.csv');
    input.on('error', e => reject(e));

    parser.on('readable', () => {
      let record;
      while (record = parser.read()) { // jshint ignore:line
        people.push(mapPerson(record));
      }
    });

    parser.on('error', e => reject(e));
    parser.on('finish', () => resolve(people));
    input.pipe(parser);
  });

db.once('open', function () {
  loadPeople()
    // Below is the way to insert that bypasses mongoose validations
    // .then((people) => {
    //   Person.collection.insert(people);
    // }

    // This inserts and runs the documents through mongoose validations
    .then(Person.insertMany)
    .then((docs)=>{
      console.log(docs.length + ' documents inserted');
    })
    .then(done)
    .catch(console.log);
});
