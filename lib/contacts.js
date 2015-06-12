var Contact = function(initObject) {
  // initObject has the format:
  // { name: { first: string, last: string }

  console.log('new Contact called with firstname %s, lastname %s',
    initObject.name.first, initObject.name.last);

  this.name = {};
  this.name.first = initObject.name.first;
  this.name.last = initObject.name.last;
};

module.exports = Contact;
