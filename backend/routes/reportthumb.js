const router = require('express').Router();
let Reportthumb = require('../models/reportthumb.model');

router.route('/').get((req, res) => {
    Reportthumb.find()
    .then(report => res.json(report))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const project = req.body.project;
  const inspector = req.body.inspector;
  const time = req.body.time;
  const location = req.body.location;
  const description = req.body.description;
  const image64str = req.body.image64str;

  const newReportthumb = new Reportthumb({
    project,
    inspector,
    time,
    location,
    description,
    image64str
  });

  newReportthumb.save()
  .then(() => res.json('Report added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;