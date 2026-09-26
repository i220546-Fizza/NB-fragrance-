const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    totalProducts,
    lowStockCount,
    pendingOrders,
    recentOrders,
    salesAgg,
    salesTrendRaw,
    statusBreakdownRaw,
  ] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ stock: { $lt: 5 } }),
    Order.countDocuments({ status: 'Pending' }),
    Order.find().sort({ createdAt: -1 }).limit(5),
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' },
          createdAt: { $gte: fourteenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const totalSales = salesAgg.length ? salesAgg[0].total : 0;

  // Build a full 14-day series, filling in zero-sale days
  const trendMap = new Map(salesTrendRaw.map((d) => [d._id, { total: d.total, count: d.count }]));
  const salesTrend = [];
  for (let i = 0; i < 14; i += 1) {
    const date = new Date(fourteenDaysAgo);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    const entry = trendMap.get(key);
    salesTrend.push({
      date: key,
      total: entry ? entry.total : 0,
      count: entry ? entry.count : 0,
    });
  }

  const statusBreakdown = statusBreakdownRaw.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  res.json({
    success: true,
    totalOrders,
    totalSales,
    totalProducts,
    lowStockCount,
    pendingOrders,
    recentOrders,
    salesTrend,
    statusBreakdown,
  });
});

module.exports = { getStats };
