var Contact = require('../lib/contacts.js');

describe('the contacts object', function() {
  describe('the constructor', function() {
    it('should return a Contacts object', function() {
      var c = new Contact({
        name: {
          first: 'Charlton',
          last: 'Wilbur'
        }
      });

      expect(c.name).toEqual({
        first: 'Charlton',
        last: 'Wilbur'
      });
    });
  });
});
