const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { jobValidation } = require('../validations/jobValidation');

router.get('/', getJobs);
router.get('/employer/myjobs', protect, authorize('employer'), getEmployerJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('employer'), jobValidation, createJob);
router.put('/:id', protect, authorize('employer'), jobValidation, updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

module.exports = router;
