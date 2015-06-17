var mongoose = require('mongoose');

var catSchema = new mongoose.Schema({
  catName: {
    type: String,
    required: true
  },
  catNickname: String,
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 25
  },
  sex: {
    type: String,
    enum: {
      values: ['male', 'female']
    }
  },
  ownerName: {
    type: String,
    required: true
  }
});

var Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
