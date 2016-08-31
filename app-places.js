// jshint node: true
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mongoose-crud');
const db = mongoose.connection;

const done = function() {
  db.close();
};

// CRUD Actions
const create = function(name, latitude, longitude, country) {
  City.create({
    name: name,
    latitude: latitude,
    longitude: longitude,
    country: country
  }).then((city) => {
    console.log(city.toJSON());
  }).catch(console.error)
    .then(done);
};

const index = function(field, criterion) {

  let search = {};

  if (arguments[0] && arguments[1]){
    let field = arguments[0];
    let criterion = arguments[1];

    if (criterion[0] === '/') {
      let regex = new RegExp(criterion.slice(1, criterion.length-1));

      search[field] = regex;
    } else {
      search[field] = criterion;
    }
  }

  City.find(search).then(function (city) {

    places.forEach(function (city) {
      console.log(city.toJSON());

    });

  }).catch(console.error)
    .then(done);
};

const show = function() {
  City.findById(id)
  .then((city) => {
    console.log(city.toJSON());
  }).catch(console.error)
    .then(done);
};

const update = function(id, field, value) {
  City.findById(id)
    .then((city) => {

     city[field] = value;

     return city.save();
   }).then(function(city){
     console.log(city.toJSON());
   }).catch(console.error)
     .then(done);
};

const destroy = function(id) {
  City.findById(id)
    .then((city) => {
    city.remove();
  }).catch(console.error)
    .then(done);
};

// UI
db.once('open', function() {
  let command = process.argv[2];

  // Using more than once, avoiding jshint complaints
  let field;
  let id;

  switch (command) {
    case 'create':
      let name = process.argv[3];
      let latitude = process.argv[4];
      let longitude =  process.argv[5];
      let country =  process.argv[6];
      if (true || name) {
        create(name, latitude, longitude, country);
      } else {
        console.log('usage create <name> <latitutde> <longitude> [country]');
        done();
      }
      break;

    case `show`:
      id = process.argv[3];
      show(id);
      break;

    case 'update':
      id = process.argv[3];
      field = process.argv[4];
      let value = process.argv[5];
      update(id, field, value);
      break;

      case 'search':
        field = process.argv[3];
        let criterion = process.arg[4];
        if (!criterion) {
          console.log('Do this: search <field> <criterion>');
          done();
        } else {
          index(field, criterion);
        }

        break;


    case 'destroy':
      id = process.argv[3];
      destroy(id);
      break;

    default:
      index();
      break;
  }

});
