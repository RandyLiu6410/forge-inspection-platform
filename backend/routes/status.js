const router = require('express').Router();
let Status = require('../models/status.model');

router.route('/').get((req, res) => {
    Status.find()
    .then(status => res.json(status))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const dbid = req.body.dbid;
  const status = req.body.status;

  const newStatus = new Status({
    dbid,
    status,
  });

  newStatus.save()
  .then(() => res.json('Status added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Status.findById(req.params.id)
    .then(status => res.json(status))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Status.findByIdAndDelete(req.params.id)
    .then(() => res.json('Status deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Status.findById(req.params.id)
    .then(status => {
        status.dbid = req.body.dbid;
        status.status = req.body.status;

        status.save()
        .then(() => res.json('Status updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;