const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
    dbid: {type: Number, require: true},
    status: {type: String, require: true}
    },
    { timestamps: true }
  );

const Status = mongoose.model('BungalowStatus', statusSchema);

module.exports = Status;