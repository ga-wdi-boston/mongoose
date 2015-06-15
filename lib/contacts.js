var mongoose = require('./mongoose-contacts.js');

var Schema = mongoose.Schema;
var contactSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  }
});

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
