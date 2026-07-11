const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      category,
      experience,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (category) query.category = category;
    if (experience) query.experience = experience;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name company website')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: jobs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching jobs' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name company website email'
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching job' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      employer: req.user._id,
      company: req.body.company || req.user.company,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Error creating job' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer - owner only)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure only the job owner can update
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating job' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer - owner only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also delete all applications for this job
    await Application.deleteMany({ job: req.params.id });

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting job' });
  }
};

// @desc    Get employer's own jobs
// @route   GET /api/jobs/employer/myjobs
// @access  Private (Employer only)
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching your jobs' });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, getEmployerJobs };
