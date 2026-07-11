const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// @desc  Get dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, jobseekers, employers, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'jobseeker' }),
      User.countDocuments({ role: 'employer' }),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    // Recent 7 days signups
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      success: true,
      stats: { totalUsers, jobseekers, employers, totalJobs, totalApplications, recentSignups },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};

// @desc  Delete a user
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

module.exports = { getAllUsers, getStats, deleteUser };
