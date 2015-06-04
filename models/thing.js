/**
 * Created by Donald on 5/25/2015.
 */

var mongoose = require('mongoose');

var thingSchema = new mongoose.Schema({
  foo: String,
  bar: Number,
  baz: Array,
  createdOn: Date,
  editedOn: Date
});

var Thing = mongoose.model("Thing", thingSchema);

module.exports = Thing;