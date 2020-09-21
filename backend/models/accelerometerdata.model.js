const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accelerometerdata = new Schema({
    SensorName: {type: String, require: true},
    SensorType: {type: String, require: true},
    Data: {
        SpectrumData: [
            {
                frequency: {
                    type: Number,
                    default: 0
                },
                value: {
                    type: Number,
                    default: 0
                }
            }],
        EventData: [
            {
                timeStamp: {
                    type: String,
                    default: ""
                },
                value: {
                    type: Number,
                    default: 0
                }
            }]
    },
    DateTime: {type: String, require: true}
    },
    { timestamps: true }
  );

const AccelerometerData = mongoose.model('MainroadAccelerometerData', accelerometerdata);

module.exports = AccelerometerData;