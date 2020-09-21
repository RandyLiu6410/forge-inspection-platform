const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sensordata = new Schema({
    SensorName: {type: String, require: true},
    SensorType: {type: String, require: true},
    Position: {type: Array, require: true},
    dbId: {type: Number, require: true},
    Data: {type: Array, require: true},
    },
    { timestamps: true }
  );

const SensorData = mongoose.model('MainroadSensorData', sensordata);

module.exports = SensorData;