

// jshint node: true
'use strict';

const mongoose = require('mongoose');
// const create = function(name, latitude, longitude, country)
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true,
    match: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/
  },
  longitude: {
    type: Number,
    required: true,
    match: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/
  },
  country: {
    type: String,
    required: true
  },

},
  {
    timestamp: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  });

// add virtual atttibute

citySchema.virtual('age').get(function(){

});

// object.age will get age


// creates city model assing person value of method model on mongoose pairs out person to personSchema
  let City = mongoose.model('City', citySchema);



// export person model
module.exports = City;
