const express = require('express');
const router  = express.Router();
const passport = require('../config/passport');
const {
  register, login, getMe, updateProfile, changePassword,
  uploadAvatar, uploadResume, toggleSaveJob, getSavedJobs,
  forgotPassword, verifyOTP, resetPassword, googleCallback,
} = require('../controllers/authController');
const { protect }   = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload, uploadAvatar: uploadAvatarMiddleware } = require('../middleware/uploadMiddleware');
const { registerValidation, loginValidation, profileValidation, passwordValidation } = require('../validations/authValidation');

// Standard auth
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, updateProfile);
router.put('/change-password', protect, passwordValidation, changePassword);

// Forgot password / OTP / Reset
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp',      verifyOTP);
router.post('/reset-password',  resetPassword);

// Google OAuth (only works when GOOGLE_CLIENT_ID is configured)
const googleConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id';

router.get('/google', (req, res, next) => {
  if (!googleConfigured) return res.status(501).json({ success: false, message: 'Google OAuth not configured' });
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
  if (!googleConfigured) return res.redirect(`${process.env.CLIENT_URL}/login?error=google_not_configured`);
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` })(req, res, next);
}, googleCallback);

// File uploads (protected)
router.post('/upload-avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.post('/upload-resume', protect, authorize('jobseeker'), upload.single('resume'), uploadResume);

// Saved jobs
router.post('/saved-jobs/:jobId', protect, authorize('jobseeker'), toggleSaveJob);
router.get('/saved-jobs',         protect, authorize('jobseeker'), getSavedJobs);

module.exports = router;
