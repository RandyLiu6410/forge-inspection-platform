const router = require('express').Router();
let Report = require('../models/report.model');

router.route('/').get((req, res) => {
    Report.find()
    .then(report => res.json(report))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/nooriginalimage').get((req, res) => {
  Report.find(null, '-_id -createdAt -updatedAt -__v -image64str')
  .then(report => res.json(report))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const newReport = new Report(req.body);

  newReport.save()
  .then(() => res.json('Report added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;