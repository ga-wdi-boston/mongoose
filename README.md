# An Introduction to Mongoose

We saw some of the weaknesses of document databases this morning: there's no protection against entering data in any arbitrary format, and no validation of any sort.  Mongoose fixes those problems.

## Objectives

* Use Mongoose to enforce completeness and validity requirements on data
* Use Mongoose as an object-document mapper within a Javascript program

## Installation and Scaffolding

At the top level of the repository:

```
npm install mongoose --save
```

We say `--save` because we want Mongoose to become a required dependency for our project.

At the beginning of your file:

```
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contacts');
```
## Mongoose is an Object-Document Mapper

What does that mean?  We have objects in our Javascript and documents in our MongoDB, and Mongoose bridges between them.

So before we start dealing with databases, we're going to start putting together a command-line contacts command.

## Mongoose has Schemas that turn into Models

```
var Schema = mongoose.Schema;

var contactSchema = newSchema({

    // we define what we're willing to accept in a Contact
    // keys are as usual; values are String, Number, Date,
    // Boolean, ObjectId, Array

});
```

We can add calculated attributes to the model too.  These are called 'virtual attributes.'  Assume we have name.first and name.last properties: we can derive a name.full property from them.

```
contactSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

contactSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});
```

When all that is done:

```
var Contact = mongoose.model( 'Contact', contactSchema);
```

## Using models in our classes

We can use Mongo syntax to find things!

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

Back to the schema!

```
var contactSchema = newSchema({

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


## Finally:

```
var c = Contact.create({ ...info... });
c.save();
```

## References

* The Mongoose API docs at [http://mongoosejs.com/docs/api.html](http://mongoosejs.com/docs/api.html)

