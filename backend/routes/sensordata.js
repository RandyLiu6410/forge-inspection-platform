const router = require('express').Router();
let Sensordata = require('../models/sensordata.model');

router.route('/').get((req, res) => {
    Sensordata.find(null, '-createdAt -updatedAt -__v')
    .then(sensordata => res.json(sensordata))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const SensorName = req.body.SensorName;
  const SensorType = req.body.SensorType;
  const Position = req.body.Position;
  const dbId = req.body.dbId;
  const Data = req.body.Data;

  const newSensordata = new Sensordata({
    SensorName,
    SensorType,
    Position,
    dbId,
    Data
  });

  newSensordata.save()
  .then(() => res.json('Sensordata added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Sensordata.findById(req.params.id)
    .then(sensordata => res.json(sensordata))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Sensordata.findByIdAndDelete(req.params.id)
    .then(() => res.json('Sensordata deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Sensordata.findById(req.params.id)
    .then(sensordata => {
        sensordata.SensorName = req.body.SensorName;
        sensordata.SensorType = req.body.SensorType;
        sensordata.Position = req.body.Position;
        sensordata.dbId = req.body.dbId;
        sensordata.Data = req.body.Data;

        sensordata.save()
        .then(() => res.json('Sensordata updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/upload/:sensorname').get((req, res) => {
    Sensordata.find({SensorName: req.params.sensorname})
    .then(sensordata => res.json(sensordata))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/upload/:sensorname').post((req, res) => {
    Sensordata.find({SensorName: req.params.sensorname})
    .then(sensordata => {
        sensordata[0].Data = req.body;
        sensordata[0].save()
        .then(() => res.json('Sensordata updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;