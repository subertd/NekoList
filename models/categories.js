/**
 * Created by Donald on 4/11/2015.
 */

var mongoose = require('mongoose');

var categoriesSchema = mongoose.Schema({
  name: String
});

mongoose.model('categories', categoriesSchema);