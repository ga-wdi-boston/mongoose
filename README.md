![General Assembly Logo](http://i.imgur.com/ke8USTq.png)

# An Introduction to Mongoose

The flexibility of MongoDB has a weakness: there's no protection against entering data in any arbitrary format, and no validation of any sort.  Mongoose helps with those problems.

## Objectives

* Use Mongoose to help validate data to be stored in MongoDB
* Use Mongoose as an object-document mapper within a JavaScript program

## Instructions

Fork and clone this repository

## Mongoose is an Object-Document Mapper

What does that mean?  We have objects in our JavaScript and documents in our MongoDB, and Mongoose bridges between them.

We'll learn about Mongoose by building some command line scripts.

## Mongoose has [Schemas](http://mongoosejs.com/docs/guide.html) that we use to create Models

```js
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/<database name>');

var Schema = mongoose.Schema;

var contactSchema = new Schema({

  name: {
    first: String,
    last: String
  }

});

var Contact = mongoose.model( 'Contact', contactSchema);

```

We'll use the models to interact with appropriately named collections of documents.  Mongoose maps the model 'Contact' to the collection contacts.

```
var c = Contact.create({ ...info... });
```

# Virtual attributes

We can add calculated attributes to the model too.  These are called 'virtual attributes.'  Assume we have name.first and name.last properties: we can derive a name.full property from them.

```js
contactSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

contactSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});
```

## Using models

We can also use Mongoose query syntax:

```
var query = Contacts.findOne({ 'name.last': 'Miller' });
query.select('name.first title company');
query.exec(function(err, contact){
    console.log('full name: %s, title: %s, company %s',
        contact.name.full, contact.title, contact.company);
});
```

## Validation

```
var contactSchema = new Schema({

    // first and last names are required

    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },

    // title is not required

    title: String,

    // age must be between 21 and 65

    age: { type: Number, min: 21, max: 65 },

    // political party must be in the list

    politicalParty: {  type: String,
            enum: { values: 'Republican Democrat Libertarian Green',
                    message: 'enum failed at path {PATH} with value {VALUE}' },
            }
        },

    // phone numbers must match the regular expression

    phoneNumber: { type: String,
        match: /(\d?\D*\d{3}\D*\d{3}\D*\d{4})/ },

});
```

## References

* The Mongoose API docs at [http://mongoosejs.com/docs/api.html](http://mongoosejs.com/docs/api.html)
