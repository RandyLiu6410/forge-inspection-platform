const router = require('express').Router();
let RailwaySchedule = require('../models/railwayschedule.model');

router.route('/').get((req, res) => {
    RailwaySchedule.find()
    .then(schedule => res.json(schedule))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const start = req.body.start;
  const end = req.body.end;
  const dbId = req.body.dbId;

  const newSchedule = new RailwaySchedule({
    id,
    name,
    start,
    end,
    dbId
  });

  newSchedule.save()
  .then(() => res.json('Schedule added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    RailwaySchedule.findById(req.params.id)
    .then(schedule => res.json(schedule))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    RailwaySchedule.findByIdAndDelete(req.params.id)
    .then(() => res.json('Schedule deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    RailwaySchedule.findById(req.params.id)
    .then(schedule => {
        schedule.id = req.body.id;
        schedule.name = req.body.name;
        schedule.start = req.body.start;
        schedule.end = req.body.end;
        schedule.dbId = req.body.dbId;

        schedule.save()
        .then(() => res.json('Schedule updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;