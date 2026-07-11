const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/:jobId', protect, authorize('jobseeker'), applyJob);
router.get('/my', protect, authorize('jobseeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
