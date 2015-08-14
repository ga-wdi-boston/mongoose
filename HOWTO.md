![General Assembly Logo](http://i.imgur.com/ke8USTq.png)

# Mongoose Reference

## How to set up a project with Mongoose and MongoDB.

1. Ensure that you have a working Node.js installation.  (See the installfest documentation from the beginning of the class or consult the web.)

2. Ensure that you have a working MongoDB. See the INSTALL.md file in the [An Introduction to MongoDB](https://github.com/ga-wdi-boston/mongodb-intro) repository.

3. Install mongoose in your project:

    ```bash
    $ npm install mongoose --save
    ```

4. In your top level entry file, and in any module that uses mongoose directly, add the line:

    ```js
    var mongoose = require('mongoose');
    ```

5. In your top level entry file, add this line to connect to your database:

    ```js
    mongoose.connect('mongodb://localhost/dbname');
    ```

Now you are all wired up and ready to use Mongoose.

## Mongoose Schemas and Models

Mongoose uses *schemas* to impose requirements on data structures.  Remember, MongoDB will let us put anything anywhere.

(I'm going to use the cat veterinary practice as an example here.)

We want one MongoDB database collection to contain Cats.  So we create an appropriate schema.

The simplest schema indicates the keys and values we accept:

```js
var catSchema = new mongoose.Schema({
    catName: String,
    catNickname: String,
    catAge: Number,
    ownerFirstName: String,
    ownerLastName: String
});
```

But this is not as useful as it might be: by default, all keys and values in a Mongoose-controlled document are optional. A more useful schema will also indicate what is required and what is optional, and what is necessary for validation:

```js
var catSchema = new mongoose.Schema({
    catName: { type: String, required: true },
    catNickname: String,
    sex: { type: String, enum: { values: ['male', 'female']},
    age: { type: Number, required: true, min: 0, max: 25 },
    ownerName: { type: String, required: true }
});
```

Once you have done this, you can say

```js
var Cat = mongoose.model('Cat', catSchema);
```

and you have a model that you can use elsewhere in your project.

(There are many more validation options; see the section below.)

## Using Models

### Creating a cat:

Mongoose provides a Modelname.create() method.  It does not return an object; it calls a callback.

```js
Cat.create({
  catName: 'Domino',
  age: 1,
  sex: 'male',
  ownerName: 'Charlton Wilbur'
}, function(error, cat) {
  // create returns the new cat in a callbac
  if (error) {
    console.error(error);
  } else {
    console.log('we created %s', cat.catName);
  }
});
```

### Retrieving a cat:

Mongoose provides findOne, findMany, and findById methods:

```js
Cat.findOne({
  catName: 'Mr. Dickens'
}, function(error, cat) {
  console.log('we found %s', cat.catName);
});

```

```js
Cat.find({
  sex: 'male'
}, function(error, catList) {
  catList.forEach(function(cat) {
    console.log('we found %s', cat.catName);
  });
});
```

(In neither of the above do we do error handling.  It's included below.)

```js
Cat.findById(ObjectId("55818163c3b65d8033134851"),
  function(error, cat) {
    if (error) {
      console.error(error);
    } else {
      console.log('found %s', cat.catName);
    }
  }
);
```

## Updates

Mr. Dickens has a birthday:

```js
Cat.findOne({
    catName: 'Mr. Dickens'
  },
  function(error, cat) {
    cat.age = cat.age + 1;
    console.log('updated %s', cat.catName);
  }
);
```

Model objects are just like any other Javascript object, and we can reach in and fiddle with keys and values when we like -- though Mongoose will yell at us if we break the rules.

## Delete

Domino is going to a different vet.

```js
Cat.remove({
  catName: 'Domino'
});

```

## Closing things out

When you're done with all the callbacks, you need to call this:

```js
mongoose.disconnect();
```

In most servers this will happen in the context of a graceful exit handler, though if you have another way of knowing all your work is done that works too.

## More Complex Validation

Back to the schema.

```js
var contactSchema = new Schema({

  // first and last names are required

  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    },
  },

  // title is not required

  title: String,

  // age must be between 21 and 65

  age: {
    type: Number,
    min: 21,
    max: 65
  },

  // political party must be in the list

  politicalParty: {
    type: String,
    enum: {
      values: ['Republican', 'Democrat', 'Libertarian', 'Green']
    }
  },

  // phone numbers must match the regular expression

  phoneNumber: {
    type: String,
    match: /(\d?\D*\d{3}\D*\d{3}\D*\d{4})/
  }

});
```
