const router = require('express').Router();
let AccelerometerData = require('../models/accelerometerdata.model');
var fs = require('fs');
var moment = require('moment')

router.route('/').get((req, res) => {
    AccelerometerData.find(null, '-createdAt -updatedAt -__v')
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/SensorName/:sensorname/DateTime/:datetime').get((req, res) => {
    AccelerometerData.findOne({SensorName: req.params.sensorname, DateTime: req.params.datetime}, '-createdAt -updatedAt -__v')
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const SensorName = req.body.SensorName;
  const SensorType = req.body.SensorType;
  const Data = req.body.Data;

  const newData = new AccelerometerData({
    SensorName,
    SensorType,
    Data
  });

  newData.save()
  .then(() => res.json('Accelerometerdata added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/GetDateData/:datetime').get((req, res) => {
    AccelerometerData.find({DateTime: req.params.datetime})
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/:id').delete((req, res) => {
//     AccelerometerData.findByIdAndDelete(req.params.id)
//     .then(() => res.json('Accelerometerdata deleted.'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/update/:id').post((req, res) => {
    AccelerometerData.findById(req.params.id)
    .then(data => {
        data.SensorName = req.body.SensorName;
        data.SensorType = req.body.SensorType;
        data.Data = req.body.Data;

        data.save()
        .then(() => res.json('Accelerometerdata updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/upload/:sensorname').get((req, res) => {
    AccelerometerData.find({SensorName: req.params.sensorname})
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/upload/:sensorname').post((req, res) => {
    AccelerometerData.findOne({SensorName: req.params.sensorname})
    .then(data => {
        data[0].Data = req.body;
        data[0].save()
        .then(() => res.json('Accelerometerdata updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/upload/:sensorname').post((req, res) => {
    AccelerometerData.findOne({SensorName: req.params.sensorname})
    .then(data => {
        data[0].Data = req.body;
        data[0].save()
        .then(() => res.json('Accelerometerdata updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/dataprocess').get((req, res) => {
    const filename_event = '/Users/CodeE/Desktop/SHM-Forge-React/SHM-Version1/backend/dataprocess/Mainroad-Demo-Data/30/MRWA_1509301431_EVENT_Demo.csv';
    const filename_spectrum = '/Users/CodeE/Desktop/SHM-Forge-React/SHM-Version1/backend/dataprocess/Mainroad-Demo-Data/30/MRWA_1509301431_EVENT-SPECTRUM_Demo.csv';
    const datetime = '1509301431'
    csvtoobj(filename_event, filename_spectrum, datetime).then(data => {
        // var json = {
        //     Data: data
        // }
        // fs.writeFile("MRWA_1509301431.json", JSON.stringify(json), function(err) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log('write done')
        // }); 
        
        // AccelerometerData.insertMany(data, (err, records) => {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     else{
        //         return console.log(records);
        //     }
        // });
    })
});

function csvtoobj(filename_event, filename_spectrum, datetime) {
    return new Promise(function(resolve, reject) {
        var jsonObj_event = []
        var jsonObj_spectrum = []
        var datatoupload = []
    
        fs.readFile(filename_spectrum,function (err,data) {
            if (err) {
              return console.log(err);
            }
    
            //Convert and store csv information into a buffer. 
            bufferString = data.toString(); 
          
            //Store information for each individual person in an array index. Split it by every newline in the csv file. 
            arr = bufferString.split('\n'); 
            var headers = arr[0].split(',');
            for(var i = 1; i < arr.length; i++) {
                var data = arr[i].split(',');
                var obj = {};
                for(var j = 0; j < data.length; j++) {
                    obj[headers[j].trim()] = data[j].trim();
                }
                jsonObj_spectrum.push(obj);
            }
            JSON.stringify(jsonObj_spectrum);
          });
    
        fs.readFile(filename_event,function (err,data) {
            if (err) {
              return console.log(err);
            }
    
            //Convert and store csv information into a buffer. 
            bufferString = data.toString(); 
          
            //Store information for each individual person in an array index. Split it by every newline in the csv file. 
            arr = bufferString.split('\n'); 
            var headers = arr[0].split(',');
            for(var i = 1; i < arr.length; i++) {
                var data = arr[i].split(',');
                var obj = {};
                for(var j = 0; j < data.length; j++) {
                    obj[headers[j].trim()] = data[j].trim();
                }
                jsonObj_event.push(obj);
            }
            JSON.stringify(jsonObj_event);
    
            Object.keys(jsonObj_event[0]).slice(1).map((name) => {
                var temp = {
                    SensorName: name,
                    SensorType: 'ACC',
                    DateTime: datetime,
                    Data: {
                        SpectrumData: [],
                        EventData: []
                    }
                }
                datatoupload.push(temp)
            })
    
            jsonObj_spectrum.map((spectrumdata) => {
                datatoupload.map((d) => {
                    if(spectrumdata[d.SensorName] != '')
                    {
                        d.Data.SpectrumData.push({
                            frequency: parseFloat(spectrumdata['Frequency']),
                            value: parseFloat(spectrumdata[d.SensorName])
                        })
                    }
                })
            })
    
            jsonObj_event.map((eventdata) => {
                datatoupload.map((d) => {
                    if(eventdata[d.SensorName] != '')
                    {
                        d.Data.EventData.push({
                            timeStamp: moment.utc(eventdata['Date & Time'], "DD/MM/YYYY HH:mm:ss").toDate(),
                            value: parseFloat(eventdata[d.SensorName])
                        })
                    }
                })
            })

            resolve(datatoupload)
          });
    });
  }

module.exports = router;