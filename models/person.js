// jshint node: true
'use strict';

var mongoose = require('mongoose');

var personSchema = new mongoose.Schema({
  dob: {
    type: Date,
    required: true,
    match: /\d{4}-\d{2}-\d{2}/
  },
  name: {
    given: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    }
  },
  gender : {
    type: String,
    enum: {
      values: ['f', 'm', 'n', 'o']
    },
    default: 'o'
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

personSchema.virtual('age').get(function() {
  var today = new Date();
  var thisYear = today.getFullYear();
  if (!this.dob) {
    return 0;
  }
  if (this.dob.getMonth() > today.getMonth() ||
    this.dob.getMonth() === today.getMonth() &&
    this.dob.getDate() >= today.getDate()) {
    thisYear -= 1;
  }
  return thisYear - this.dob.getFullYear();
});

// model
var Person = mongoose.model('Person', personSchema);

module.exports = Person;
