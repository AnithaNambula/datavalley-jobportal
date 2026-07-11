const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Jobseeker only)
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ success: false, message: 'This job is no longer active' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || '',
      yearOfPassout: req.body.yearOfPassout || null,
      applicantSkills: req.body.applicantSkills || [],
    });

    // Increment applications count
    await Job.findByIdAndUpdate(req.params.jobId, {
      $inc: { applicationsCount: 1 },
    });

    await application.populate('job', 'title company location type');

    res.status(201).json({ success: true, application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }
    res.status(500).json({ success: false, message: 'Error applying for job' });
  }
};

// @desc    Get logged-in jobseeker's applications
// @route   GET /api/applications/my
// @access  Private (Jobseeker)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salary isActive')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching applications' });
  }
};

// @desc    Get applications for a specific job (Employer view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications',
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills experience location phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching applications' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      'job',
      'employer'
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = req.body.status;
    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating application status' });
  }
};

module.exports = { applyJob, getMyApplications, getJobApplications, updateApplicationStatus };
