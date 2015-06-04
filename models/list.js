/**
 * Created by Donald on 6/3/2015.
 *
 * @citation got the info about how to reference another mongoose schema here:
 * http://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
 */

var mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true},
  items: [
    {
      name:{
        type: String,
        required:true
      },
      check: Boolean
    }
  ]
});

var List = mongoose.model("List", listSchema);

module.exports = List;