const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      default: '',
    },
    otp: {
      code:      { type: String,  default: null },
      expiresAt: { type: Date,    default: null },
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer', 'recruiter', 'admin'],
      default: 'jobseeker',
    },
    // Jobseeker profile fields
    resume: {
      type: String,
      default: '',
    },
    skills: [String],
    experience: {
      type: String,
      default: '',
    },
    // Employer profile fields
    company: {
      type: String,
      default: '',
    },
    companyDescription: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
