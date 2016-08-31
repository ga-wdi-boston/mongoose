// jshint node: true
'use strict';

const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90,
    required: true,
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
    required: true,
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

  placeSchema.virtual('isNorthernHemisphere?').get(function(){
    if (this.latitude > 0){
      return true;
    }
  });

  placeSchema.virtual('isWesternHemisphere?').get(function(){
    if (this.latitude < 0){
      return true;
    }
  });

  let Place = mongoose.model('Place', placeSchema);

  module.exports = Place;
