const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, company } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'jobseeker',
      company: role === 'employer' ? company : '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        location: user.location,
        phone: user.phone,
        skills: user.skills,
        experience: user.experience,
        resume: user.resume,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      location,
      skills,
      experience,
      resume,
      company,
      companyDescription,
      website,
    } = req.body;

    const updateData = {
      name,
      phone,
      location,
    };

    if (req.user.role === 'jobseeker') {
      updateData.skills = skills;
      updateData.experience = experience;
      updateData.resume = resume;
    }

    if (req.user.role === 'employer') {
      updateData.company = company;
      updateData.companyDescription = companyDescription;
      updateData.website = website;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/auth/upload-avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }
    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );
    res.json({ success: true, message: 'Avatar uploaded successfully', avatar: avatarPath, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user resume file
// @route   POST /api/auth/upload-resume
// @access  Private (Jobseeker only)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const resumePath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: resumePath },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: resumePath,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle saving a job listing
// @route   POST /api/auth/saved-jobs/:jobId
// @access  Private (Jobseeker only)
const toggleSaveJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const user = await User.findById(req.user._id);

    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
      await user.save();
      res.json({ success: true, message: 'Job unsaved successfully', savedJobs: user.savedJobs });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      res.json({ success: true, message: 'Job saved successfully', savedJobs: user.savedJobs });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved jobs for current user
// @route   GET /api/auth/saved-jobs
// @access  Private (Jobseeker only)
const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: {
        path: 'employer',
        select: 'name company',
      },
    });

    res.json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};

const { sendOTPEmail } = require('../utils/sendEmail');

// @desc   Forgot password — send OTP
// @route  POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();

    await sendOTPEmail(email, otp, user.name);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) { next(error); }
};

// @desc   Verify OTP
// @route  POST /api/auth/verify-otp
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.otp?.code) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    if (user.otp.code !== otp)    return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    if (new Date() > user.otp.expiresAt) return res.status(400).json({ success: false, message: 'OTP has expired' });

    // Mark OTP verified (clear code, keep expiresAt for reset window)
    user.otp = { code: null, expiresAt: new Date(Date.now() + 15 * 60 * 1000) };
    await user.save();
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) { next(error); }
};

// @desc   Reset password after OTP verified
// @route  POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const user = await User.findOne({ email });
    if (!user || !user.otp?.expiresAt || new Date() > user.otp.expiresAt)
      return res.status(400).json({ success: false, message: 'Reset session expired. Request a new OTP.' });

    user.password = newPassword;
    user.otp = { code: null, expiresAt: null };
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) { next(error); }
};

// @desc   Google OAuth callback — issue JWT
// @route  GET /api/auth/google/callback
const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = require('../utils/generateToken')(user._id);
    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
    // Redirect to frontend with token
    res.redirect(`${clientURL}/auth/google/success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&role=${user.role}&avatar=${encodeURIComponent(user.avatar || '')}&id=${user._id}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_failed`);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  uploadResume,
  toggleSaveJob,
  getSavedJobs,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleCallback,
};
