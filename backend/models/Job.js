const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    requirements: [String],
    skills: [String],
    experience: {
      type: String,
      enum: ['Entry Level', '1-2 years', '3-5 years', '5+ years'],
      default: 'Entry Level',
    },
    category: {
      type: String,
      enum: [
        'Technology',
        'Marketing',
        'Finance',
        'Healthcare',
        'Education',
        'Design',
        'Sales',
        'Engineering',
        'Other',
      ],
      default: 'Technology',
    },
    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);
