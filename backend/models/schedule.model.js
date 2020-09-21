const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    id: {type: Number, require: true},
    name: {type: String, require: true},
    start: {type: Date, require: true},
    end: {type: Date, require: true},
    dbId: {type: Array, require: true}
    },
    { timestamps: true }
  );

const Schedule = mongoose.model('BungalowSchedule', scheduleSchema);

module.exports = Schedule;