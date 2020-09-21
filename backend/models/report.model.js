const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    project: {type: String, require: true},
    inspector: {type: String, require: true},
    time: {type: String, require: true},
    location: [{type: Number, require: true}],
    description: {type: String, require: true},
    image64str: {type: String, require: true},
    thumbimage64str: {type: String, require: true},
    },
    { timestamps: true }
  );

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;