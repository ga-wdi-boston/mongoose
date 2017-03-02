// jshint node: true
'use strict';



const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost/mongoose-crud');

const db = mongoose.connection;

// require model file
const City = require('./models/place.js');


const done = function() {
  db.close();
};



const create = function (name, latitude, longitude, country) {
 City.create({
   name: name,
   latitude: latitude,
   longitude: longitude,
   country: country,
 }).then((city) => {
   console.log(city.toJSON());
 }).catch(console.error)
 .then(done);
};

// ~/wdi/training/mongoose-crud (training)$ node app-places.js create new 10002230 29002020 new
// { __v: 0,
//   name: 'new',
//   latitude: 10002230,
//   longitude: 29002020,
//   country: 'new',
//   _id: 57c639c9e32caf717652c1dd,
//   something: undefined,
//   id: '57c639c9e32caf717652c1dd' }
// ~/wdi/training/mongoose-crud (training)$


// ~/wdi/training/mongoose-crud (training)$ node app-places.js create new 10002230 29002020 newcountry
// { __v: 0,
//   name: 'new',
//   latitude: 10002230,
//   longitude: 29002020,
//   country: 'newcountry',
//   _id: 57c63a148ac90e90767e6b58,
//   something: undefined,
//   id: '57c63a148ac90e90767e6b58' }
// ~/wdi/training/mongoose-crud (training)$



const index = () => {

    let search = {};

    if (arguments[0] && arguments[1]){

      let field = arguments[0];

      let criterion = arguments[1];


      if (criterion[0] === '/') {

        let regex = new RegExp(criterion.slice(1, criterion.length -1));
        search[field] = regex;
        } else {

          search[field] = criterion;
        }
  }

  City.find(search).then(function(places) {
    // list of people
    // take it and log it
    // if resovled then(done)
    places.forEach(function (city) {
      console.log(city.toJSON());
    });
  }).catch(console.error)
    .then(done);

};


//
// ~/wdi/training/mongoose-crud (training)$ node app-places.js index
// { _id: 57c639c9e32caf717652c1dd,
//   name: 'new',
//   latitude: 10002230,
//   longitude: 29002020,
//   country: 'new',
//   __v: 0,
//   something: undefined,
//   id: '57c639c9e32caf717652c1dd' }
// { _id: 57c63a148ac90e90767e6b58,
//   name: 'new',
//   latitude: 10002230,
//   longitude: 29002020,
//   country: 'newcountry',
//   __v: 0,
//   something: undefined,
//   id: '57c63a148ac90e90767e6b58' }
//


const show = function(id) {


  City.findById(id)
  .then((city) => {
    console.log(city.toJSON());
  }).catch(console.error)
    .then(done);

};

// ~/wdi/training/mongoose-crud (training)$ node app-places.js show 57c63a148ac90e90767e6b58
// { _id: 57c63a148ac90e90767e6b58,
//   name: 'new',
//   latitude: 10002230,
//   longitude: 29002020,
//   country: 'newcountry',
//   __v: 0,
//   something: undefined,
//   id: '57c63a148ac90e90767e6b58' }
// ~/wdi/training/mongoose-crud (training)$

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

// ~/wdi/training/mongoose-crud (training)$ node app-places.js update 57c63a148ac90e90767e6b58 name updatedNAME
// { _id: 57c63a148ac90e90767e6b58,
//   name: 'updatedNAME',
//   latitude: 10002230,
//   longitude: 29002020,
//   country: 'newcountry',
//   __v: 0,
//   something: undefined,
//   id: '57c63a148ac90e90767e6b58' }
// ~/wdi/training/mongoose-crud (training)$


const destroy = function(id) {

  City.findById(id)
    .then((city) => {
    city.remove();
  }).catch(console.error)
    .then(done);
};

// ~/wdi/training/mongoose-crud (training)$ node app-places.js destroy 57c63a148ac90e90767e6b58
// ~/wdi/training/mongoose-crud (training)$

db.once('open', function() {
  let command = process.argv[2];


  let field;
  let id;


  switch (command) {
    case 'create':
      let givenName = process.argv[3];
      let surname = process.argv[4];
      let dob =  process.argv[5];
      let gender =  process.argv[6];
      let height = process.argv[7];
      let weight = process.argv[8];
      if (true || givenName) {
        create(givenName, surname, dob, gender, height, weight);
      } else {
        console.log('usage c <given_name> <surname> <date of birth> [gender], <height>, <weight>');
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
      let criterion = process.argv[4];

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
