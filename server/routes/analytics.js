const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/analytics
// @desc    Get dashboard analytics
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Total leads count
    const totalLeads = await Lead.countDocuments();

    // Count by status
    const statusCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Count by source
    const sourceCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent leads (last 5)
    const recentLeads = await Lead.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email status source createdAt');

    // Leads created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newLeadsThisWeek = await Lead.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Conversion rate
    const convertedCount = statusCounts.find(s => s._id === 'converted')?.count || 0;
    const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : 0;

    // Format status counts into an object
    const statusMap = {};
    statusCounts.forEach(item => {
      statusMap[item._id] = item.count;
    });

    // Format source counts into an object
    const sourceMap = {};
    sourceCounts.forEach(item => {
      sourceMap[item._id] = item.count;
    });

    res.json({
      totalLeads,
      newLeadsThisWeek,
      conversionRate: parseFloat(conversionRate),
      statusBreakdown: {
        new: statusMap.new || 0,
        contacted: statusMap.contacted || 0,
        converted: statusMap.converted || 0,
        lost: statusMap.lost || 0,
      },
      sourceBreakdown: sourceMap,
      recentLeads,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

module.exports = router;
