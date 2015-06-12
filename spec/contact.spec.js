var util = require('util');
var mongoose = require('../lib/mongoose-contacts.js');
var Contact = require('../lib/contacts.js');

describe('the contacts object', function() {
  describe('Contact.create', function() {

    it('creates a Contact object with the supplied parameters', function(done) {
      Contact.create({
        name: {
          first: 'Charlton',
          last: 'Wilbur'
        }
      }, function(err, c) {
        expect(c.name.first).toBe('Charlton');
        expect(c.name.last).toBe('Wilbur');
        done();
      });
    });
  });
});
