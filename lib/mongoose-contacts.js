var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contacts');

module.exports = mongoose;
