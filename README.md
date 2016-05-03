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

### Other Key Schema/Model Features

#### Schema Options : Setters

In addition to specifying what type of data each attribute is,
 we can also specify other features,
 such as default values or default transformations
 (i.e. automatically uppercasing or lowercasing strings).

This can be done by replacing the type's name in the Schema with an object,
 like so:

```javascript
const someSchema = new mongoose.Schema({
  name: {
    given: {
      type: String
      set: capitalize
    },
    surname:  {
      type: String
      set: capitalize
    },
  }
  location: {
    type: String,
    default: 'Boston'
  }
});
```

A full list of these options can be found in the [Mongoose API documentation](http://mongoosejs.com/docs/api.html).

#### Schema Options : Validators

As mentioned, MongoDB does not put any limitations on what you put in your
 collections.
Fortunately, Mongoose provides a way to add some boundaries using
 [validators](http://mongoosejs.com/docs/validation.html).

```javascript
const someSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    height: Number
});
```

Validators are associated with different 'SchemaTypes',
 i.e. the kind of data that the attribute holds.
Every SchemaType implements the `required` validator,
 but they also each have their own type-specific validators built in.

| Type    | Built-In Validators                            |
|:-------:|:----------------------------------------------:|
| String  | `enum`, `match`, `maxlength`, `minlength`      |
| Number  | `max`, `min`                                   |
| Date    | `max`, `min`                                   |

Additionally, custom validators can be written for any type at any time,
using the `validate` option:

```javascript
const someSchema = new Schema({
    someEvenValue : {
      type: Number
      validate: {
        validator: function(num){
          return num%2 === 0;
        },
        message: 'Must be even.'
      }
    }
});
```

#### Virtual Attributes

Another neat feature of Schemas is the ability to define 'virtual attributes':
 attributes whose values are interelated with the values of other attributes.
In reality, these 'attributes' are actually just a pair of functions -
 `get` and `set`, specifically.

Assuming we have `name.given` and `name.surname` properties:
 we can derive a `name.full property` from them.

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

## Code-Along

We're going to create a simple _command-line_ program that allows us
 to perform CRUD in a MongoDB database called `mongoose-crud`
 over a collection called `people`, and display JSON data back in the console.
The code for this program will be found in `app-people.js`,
 in the root of this repository.
The code for reading from the console has already been written for us
 so that we can focus _exclusively_ on the Mongoose piece of the puzzle.

As you can see, the code in that section is incomplete.

```javascript
const create = function(givenName, surname, dob, gender) {
  /* Add Code Here */
};

const index = function() {
  /* Add Code Here */
};

const show = function(id) {
  /* Add Code Here */
};

const update = function(id, field, value) {
  /* Add Code Here */
};

const destroy = function(id) {
  /* Add Code Here */
};
```

We're going to add the missing code so that our app can do CRUD.

First, we need to create the database that `app-people.js` references,
 `mongoose-crud`.

```bash
mongo mongoose-crud
```

Next, let's create a `person.js` file to hold the Schema and
 Model for our new Person resource.
To keep things organized, let's put `person.js` in the `models` directory.

Inside `person.js`, let's first define a Schema for Person.
A person should have several properties:
 `name.given`, `name.surname`, `dob`, `gender`, and `age` (a virtual property).
Additionally, each Person document should have timestamps indicating
 when it was created and when it was last modified.

Next, we'll use the Schema to generate a new Model,
 and export that Model out of the module.

Finally, we'll need to `require` this Model from `app-people.js`
 if we want to be able to use it there.

Now let's actually get into writing the CRUD actions.

### Create

Finishing the `create` method will be pretty straightforward,
 since Mongoose already gives us a `create` method.

According to the documentation, here is the signature for `create`:

```javascript
Model.create(doc(s), [callback])
```

This means that the `create` method takes an object representing a document
 (or several objects, representing multiple documents)
 with an optional callback as the final argument.
That callback will be handed several arguments:
 first, a reference to any errors created during the `create` operation,
 and
 second, a list of references to the newly created documents
 (one for each object passed in).

Suppose that we also want to print out the newly created Person
 once we've created it.
We could write:

```javascript
const create = function(givenName, surname, dob, gender) {
  Person.create({
    'name.given': givenName,
    'name.surname': surname,
    dob: dob,
    gender: gender,
  }, function(err, person){
    console.log(person.toJSON());
    done();   // We need to call this to terminate the connection.
  })
};
```

However, if we wanted any other functions to run in sequence
 after the `create` finished,
 it's easy to see how you could end up in the infamous 'callback hell'.
Let's try and refactor this using Promises instead.

```javascript
const create = function(givenName, surname, dob, gender) {
  Person.create({
    'name.given': givenName,
    'name.surname': surname,
    dob: dob,
    gender: gender,
  }).then(function(person){
    console.log(person.toJSON());
    done();   // We need to call this to terminate the connection.
  }).catch(function(err){
    console.error(err);
  });
};
```

Since we're using Promises, we can also move `done` to the end of the
 Promise chain.

```javascript
  ...
  }).then(function(person){
    console.log(person.toJSON());
  }).catch(function(err){
    console.error(err);
  }).then(done);
};
```

Also, since that last function is just wrapping around `console.error`,
 we can simplify the `catch` as

```javascript
  ...
  }).catch(console.error).then(done);
};
```

### Read

Next, let's fill in the `index` and `read` (i.e. `search`) methods.
To do this, we're going to need to query MongoDB using Mongoose.
Mongoose has a couple of methods for doing this, just like ActiveRecord did.

| Mongoose Method | Rough ActiveRecord Equivalent          |
|:---------------:|:---------------------------------------|
| `find`          | `where` (or, with no arguments, `all`) |
| `findById`      | `find`                                 |
| `findOne`       | `find_by`                              |

For `index`, we want to get all People, so we'll use `find`.

The Mongoose documentation gives the signature of `find` as

```javascript
Model.find(conditions, [projection], [options], [callback])
```

 where `conditions` are the search parameters, i.e. `{'name.given': 'Bob'}`;
 optional parameters `projection` and `options` offer additional configuration;
 lastly, `find` accepts a callback.

We want to get all results, so we can pass in
 an empty object as the first argument
 and a callback function as the final argument.

```javascript
const index = function() {
  Person.find({}, function(err, people){
    if (err) {
      console.error(err);
      return;
    }
    people.forEach(function(person){
      console.log(person.toJSON());
    });
    done();
  })
};
```

A little messy. Let's refactor this with Promises.

```javascript
const index = function() {
  Person.find({}).then(function(people) {
    people.forEach(function(person) {
      console.log(person.toJSON());
    });
  }).catch(console.error).then(done);
};
```

Note how now we didn't pass `find` a callback - that's how Mongoose knows
 that it needs to return a Promise.

If we wanted, we could easily add some code to `index`
 to give it the ability to provide a filtered set of results,
 searching based on some specified value or regular expression.

```javascript
const index = function() {
  let search = {};
  if (arguments[0] && arguments[1]) {
    let field = arguments[0];
    let criterion = arguments[1];
    if (criterion[0] === '/') {   // If a regular expression
      let regex = new RegExp(criterion.slice(1, criterion.length - 1));
      search[field] = regex;
    } else {                      // If not a regular expression
      search[field] = criterion;
    }
  }
  Person.find(search).then(function(people) {
    people.forEach(function(person) {
      console.log(person.toJSON());
    });
  }).catch(console.error).then(done);
};
```

To add this to our app, we would only need to add another case to our switch:

```javascript
switch(command) {
  //...
  case 'search':
    field  = process.argv[3];
    let criterion = process.argv[4];
    if (!criterion) {
      console.log('usage: search <field> <criterion>');
      done();
    } else {
      index(field, criterion);
    }
    break;
  //...
}
```

Now let's implement `show`. We'll use `findById` instead of `find`,
 since we specifically want to look up a document by its ID.

```javascript
const show = function(id) {
  Person.findById(id, function(err, person){
    if (err) {
      console.error(err);
      return;
    }
    console.log(person.toJSON());
    done();
  });
};
```

With Promises, this is even simpler.

```javascript
const show = function(id) {
  Person.findById(id).then(function(){
    console.log(person.toJSON());
  }).catch(console.error).then(done);
};
```

### Update

To do an update in Rails, you need to
 (a) look up the record you want by its ID, and then
 (b) have it update one or more of its values.
As we've just seen, the first of these can be accomplished using `findById`.
To do the second, we need to actually change a property on the document,
 and then run [`.save`](http://mongoosejs.com/docs/api.html#model_Model-save).

If we were to do that here in `update`, our code might look something like this:

```javascript
const update = function(id, field, value) {
  Person.findById(id, function(err, person){
    if (err) {
      console.error(err);
      return;
    }
    person[field] = value;
    person.save(function(err){
      if (err) {
        console.error(err);
        return;
      }
      console.log(person.toJSON());
      done();
    });
  });
};
```

This code is even more terse and flexible when written with Promises.

```javascript
const update = function(id, field, value) {
  let modify = {};
  modify[field] = value;
  Person.findById(id)
    .then(function(person) {
      person[field] = value;
      return person.save();
    }).then(
      console.log(person.toJSON());
    ).catch(console.error)
    .then(done);
};
```

### Destroy

The `destroy` method should look a lot like the `show` and `update` methods.
As with `show`, we might start with

```javascript
const destroy = function(id) {
  Person.findById(id, function(err, person) {
    //...
  });
};
```

or, if we're using Promises,

```javascript
const destroy = function(id) {
  Person.findById(id).then(function(person){
    //...
  }).catch(/* ... */).then(/* ... */)
};
```

The Mongoose method we want to use here is [`remove`](http://mongoosejs.com/docs/api.html#query_Query-remove);
 our finished method looks like this:

```javascript
const destroy = function(id) {
  Person.findById(id).then(function(person){
    person.remove();
  }).catch(console.error).then(done);
};
```

## Lab

In your squads, repeat this exercise for a new resource, Places.
Places have the following features:

-   name (required)
-   latitude (required)
-   longitude (required)
-   country
-   isNorthernHemisphere? (virtual)
-   isWesternHemisphere? (virtual)

You should ensure that only reasonable values of latitude and longitude are
 allowed to be added to the database.

Create a new file for your Mongoose model, and load it from
 the `app-places.js` file; that file will provide a command-line UI for
 performing CRUD on you new Places resource.

Like in the code-along, the 'action' methods in `app-places.js` have no content;
 you'll need to fill them up with code for doing CRUD on your new model.

## Additional Resources

-   The Mongoose API docs at [http://mongoosejs.com/docs/api.html](http://mongoosejs.com/docs/api.html)

## [License](LICENSE)

Source code distributed under the MIT license. Text and other assets copyright
General Assembly, Inc., all rights reserved.
