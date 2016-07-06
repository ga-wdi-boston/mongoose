// jshint node: true
'use strict';

const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
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
  dob: {
    type: Date,
    required: true,
    match: /\d{4}-\d{2}-\d{2}/
  },
  gender: {
    type: String,
    enum: {
      values: ['f', 'm', 'n', 'o'],
    },
    default: 'o'
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true,
  }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

personSchema.virtual('age').get(function() {
  let today = new Date();
  let thisYear = today.getFullYear();
  if (!this.dob) {
    return 0;
  }
  if (this.getMonth() > today.getMonth() ||
      this.getMonth() === today.getMonth() &&
      this.getDate() >= today.getDate()) {
        thisYear -= 1;
      }

      return thisYear - this.dob.getFullYear();
});

// model
let Person = mongoose.model('Person', personSchema);

module.exports = Person;
