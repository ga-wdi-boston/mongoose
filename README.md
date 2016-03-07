[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# An Introduction to Mongoose

As you saw in the previous talk, MongoDB is extremely flexible -
 if you want, you can store data of literally any structure in a collection,
 even if you haven't defined that structure beforehand.
However, this flexibility has a weakness:
 since you can enter data in _**any arbitrary format**_,
 and there's no built-in validation to permit/reject new documents,
 there's no assurance that the documents in a collection
 will be consistent in any way.
Fortunately, there's a tool called Mongoose that will help to address these
 problems.

## Prerequisites

-   MongoDB

## Objectives

-   Use Mongoose to access and manipulate a MongoDB database from
     a JavaScript program.
-   Use JavaScript Promises to combine Mongoose operations.
-   Set up validations in Mongoose to validate data for storage in MongoDB.

## Preparation

Fork and clone this repo; then run `npm install`.

## Mongoose Schemas, Models, and Documents

**"Mongoose is an Object-Document Mapper"**

What does that mean?

When we were learning about Rails, we used a tool called ActiveRecord;
 ActiveRecord was an "Object-Relational Mapper",
 a tool that allowed us to take relations (i.e. rows) from a SQL table
 and represent them with Ruby objects.
Mongoose fills a similar role, allowing us to represent documents
 (the MongoDB analogue to SQL relations) using JavaScript objects.
Additionally, because Mongoose fits in between our JS code and Mongo,
 it's able to add some limitations on how Mongo gets used,
 so that there's greater consistency in our data.

The core elements of Mongoose are:

-   [Documents](http://mongoosejs.com/docs/documents.html),
     JavaScript objects that map to Documents in MongoDB.
-   [Models](http://mongoosejs.com/docs/models.html),
     which are Constructor functions that generate new Documents.
-   [Schemas](http://mongoosejs.com/docs/guide.html),
     which specify the properties that the Models give
     to their respective Documents.

Let's look at an example.

```javascript
const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    given: String,
    surname: String
  }
});

const Person = mongoose.model('Person', PersonSchema);

let person = Person.create({...});
// alternatively,
/*
   let person = new Person({...});
   person.save();
*/
```

`personSchema` above is a new Mongoose Schema;
 it specifies a `name` property with `given` and `surname` sub-properties.
That Schema gets passes into `mongoose.model` as an argument,
 where it is used to create the `Person` model;
 Mongoose uses the first argument to map this model
 to the MongoDB collection `people`.
Finally, we call `Person.create` to create a new Person document,
 and store the result in `person`.


### Virtual Attributes

We can add calculated attributes to the model too.
These are called 'virtual attributes.'
Assume we have name.given and name.surname properties:
 we can derive a name.full property from them.

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

## Using Models

We'll use Mongoose to query MongoDB:

```javascript
var query = Person.findOne({ 'name.surname': 'Rollins' });
query.exec().then(function(person) {
    console.log('full name: %s, given: %s, surname %s',
        person.name.full, person.name.given, person.name.surname);
});
```

### Validation

```javascript
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

## Additional Resources

-   The Mongoose API docs at [http://mongoosejs.com/docs/api.html](http://mongoosejs.com/docs/api.html)

## [License](LICENSE)

Source code distributed under the MIT license. Text and other assets copyright
General Assembly, Inc., all rights reserved.
