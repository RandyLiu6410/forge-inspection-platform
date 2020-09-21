const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit: "10mb"}));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
/*
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("shm").collection("status-bungalow");
});*/

const statusRouter = require('./routes/status');
const scheduleRouter = require('./routes/schedule');
const railwayscheduleRouter = require('./routes/railwayschedule');
const sensordataRouter = require('./routes/sensordata');
const reportRouter = require('./routes/report');
const reportthumbRouter = require('./routes/reportthumb');
const accelerometerdataRouter = require('./routes/accelerometerdata');

app.use('/status-station', statusRouter);
app.use('/status-bungalow', statusRouter);
app.use('/schedule-bungalow', scheduleRouter);
app.use('/schedule-railway', railwayscheduleRouter);
app.use('/sensordata-mainroad', sensordataRouter);
app.use('/report', reportRouter);
app.use('/reportthumb', reportthumbRouter);
app.use('/accelerometerdata', accelerometerdataRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});