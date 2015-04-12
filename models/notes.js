/**
 * Created by Donald on 4/11/2015.
 */
var mongoose = require('mongoose');

var notesSchema = mongoose.Schema({
  title: String,
  description: String,
  public: Boolean,
  priority: Number,
  body: String,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'categories'
  }
});

mongoose.model('notes', notesSchema);
