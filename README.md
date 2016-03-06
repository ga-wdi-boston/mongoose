![General Assembly Logo](http://i.imgur.com/ke8USTq.png)

# An Introduction to Mongoose

The flexibility of MongoDB has a weakness: there's no protection against entering data in any arbitrary format, and no validation of any sort.  Mongoose helps with those problems.

## Objectives

* Use Mongoose to help validate data to be stored in MongoDB
* Use Mongoose as an object-document mapper within a JavaScript program

## Instructions

Fork, clone, and npm install.

## Mongoose is an Object-Document Mapper

What does that mean?  We have objects in our JavaScript and documents in our MongoDB, and Mongoose bridges between them.

We'll learn about Mongoose by building a command line script.  Think of the script as a similar to a controller and the Mongoose Models as the mechanism to access the data (ActiveRecord).

## Mongoose has

- [Schemas](http://mongoosejs.com/docs/guide.html) that we use to create models.
- [Models](http://mongoosejs.com/docs/models.html) - Constructors for documents
- [Documents](http://mongoosejs.com/docs/documents.html) - a mapping from MongoDB to JavaScript
- [Validations](http://mongoosejs.com/docs/validation.html) checks on our data.
-

We'll use these to create a command line crud app.

### Schema

```js
var mongoose = require('mongoose');

var peronsSchema = new mongoose.Schema({

  name: {
    given: String,
    surname: String
  }

});
```

### Model

```
var Person = mongoose.model( 'Person', PersonSchema);

```

We'll use the models to interact with appropriately named collections of documents.  Mongoose maps the model 'Person' to the MongoDB collection people.

### Document

```
var person = Person.create({...});
// or
var person = new Person({...});
person.save();
```

### Virtual attributes

We can add calculated attributes to the model too.  These are called 'virtual attributes.'  Assume we have name.given and name.surname properties: we can derive a name.full property from them.

```js
personSchema.virtual('name.full').get(function () {
  return this.name.given + ' ' + this.name.surname;
});

personSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.given = split[0];
  this.name.surname = split[1];
});
```

## Using models

We'll use Mongoose to query MongoDB:

```
var query = Person.findOne({ 'name.surname': 'Rollins' });
query.exec().then(function(person) {
    console.log('full name: %s, given: %s, surname %s',
        person.name.full, person.name.given, person.name.surname);
});
```

### Validation

```
var contactSchema = new Schema({

    // given and surname are required

    name: {
      given: {
        type: String,
        required: true
      },
      surname: {
        type: String,
        required: true
      },
    },

    // title is not required

    title: String
});
```

## References

* The Mongoose API docs at [http://mongoosejs.com/docs/api.html](http://mongoosejs.com/docs/api.html)

## [License](LICENSE)

Source code distributed under the MIT license. Text and other assets copyright
General Assembly, Inc., all rights reserved.
