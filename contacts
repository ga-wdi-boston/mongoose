#!/usr/bin/env node

var util = require('util');
var program = require('commander');
var Contact = require('./lib/contacts.js');

program.version('0.1.0');

program
  .command('init')
  .description('initialize the database')
  .action(function() {

  }).on('--help', function() {
    console.log('Example:');
    console.log();
    console.log('  $ contacts init');
  });

program
  .command('add')
  .description('add a user to the contacts database')
  .option('--first-name [name]', 'contact\'s first name')
  .option('--last-name [name]', 'contact\'s last name')
  .action(function() {

    var c = Contact.create({
      name: {
        first: this.firstName,
        last: this.lastName
      }
    });

    c.save();

  }).on('--help', function() {
    console.log('Example:');
    console.log();
    console.log('  $ contacts add --first-name Charlton --last-name Wilbur');
  });

var testData = ['node',
  '/Users/cwilbur/Development/wdi_7_mongoose_intro/contacts',
  'add',
  '--first-name',
  'Charlton',
  '--last-name',
  'Wilbur'
];

program.parse(process.argv);
