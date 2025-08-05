const express = require('express');
const router = express.Router();
const job_controller = require('../controllers/job_controller');

router.post('/',job_controller.createJob);

router.get('/:id',job_controller.getJobById);

router.get('/',job_controller.getAllJobs);

module.exports = router;