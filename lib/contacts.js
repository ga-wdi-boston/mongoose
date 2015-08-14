'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contacts');

var Schema = mongoose.Schema;
var contactSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
