const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Flat delivery charge applied to every order, with no exceptions —
// not by subtotal, quantity, location, customer, or promotion. This is
// the single source of truth; the client can never override it.
const DELIVERY_CHARGE = 200;

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// @desc    Create a new order (guest checkout allowed)
// @route   POST /api/orders
// @access  Public (optionally authenticated)
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, customerInfo, shippingAddress, notes, paymentMethod } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
    res.status(400);
    throw new Error('customerInfo (fullName, email, phone) is required');
  }

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
    res.status(400);
    throw new Error('shippingAddress (address, city, postalCode) is required');
  }

  // Re-validate each item's price & stock from the database - never trust client-sent prices
  const validatedItems = [];
  let itemsPrice = 0;

  for (const item of orderItems) {
    if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
      res.status(400);
      throw new Error('Each order item must reference a valid product id');
    }

    const qty = Number(item.qty) || 0;
    if (qty < 1) {
      res.status(400);
      throw new Error('Each order item must have a quantity of at least 1');
    }

    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (!item.size) {
      res.status(400);
      throw new Error(`A bottle size is required for "${product.name}"`);
    }

    // Never trust a client-sent price — look up the real price for the
    // requested size on the product itself.
    const sizeOption = (product.sizes || []).find((s) => s.size === item.size);
    if (!sizeOption) {
      res.status(400);
      throw new Error(`"${item.size}" is not an available size for "${product.name}"`);
    }

    if (product.stock < qty) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
    }

    validatedItems.push({
      product: product._id,
      name: product.name,
      image: product.images && product.images.length ? product.images[0] : '',
      price: sizeOption.price,
      qty,
      size: sizeOption.size,
    });

    itemsPrice += sizeOption.price * qty;
    product.stock -= qty;
    await product.save();
  }

  // Delivery is always Rs. 200 — fixed server-side, ignoring anything the
  // client sends, and never reduced to 0 for any order value, quantity,
  // customer, or promotion.
  const deliveryCharge = DELIVERY_CHARGE;
  const totalPrice = itemsPrice + deliveryCharge;

  const order = await Order.create({
    user: req.user ? req.user._id : undefined,
    orderItems: validatedItems,
    customerInfo,
    shippingAddress,
    notes: notes || '',
    paymentMethod: paymentMethod || 'Cash on Delivery',
    itemsPrice,
    deliveryCharge,
    totalPrice,
    status: 'Pending',
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get single order by id (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order id');
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Guest orders (no account attached) are viewable by anyone with the order
  // id/link, e.g. straight after checkout on the order confirmation page.
  // Orders placed by a logged-in customer require that customer or an admin.
  const isGuestOrder = !order.user;
  const isOwner = Boolean(req.user) && order.user && order.user._id.toString() === req.user._id.toString();
  const isAdmin = Boolean(req.user) && req.user.role === 'admin';

  if (!isGuestOrder && !isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// @desc    Get all orders (admin) with optional status filter and search
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status) {
    if (!ORDER_STATUSES.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status filter. Must be one of: ${ORDER_STATUSES.join(', ')}`);
    }
    query.status = status;
  }

  if (search) {
    const orClauses = [
      { 'customerInfo.fullName': { $regex: search, $options: 'i' } },
      { 'customerInfo.email': { $regex: search, $options: 'i' } },
    ];
    if (mongoose.Types.ObjectId.isValid(search)) {
      orClauses.push({ _id: search });
    }
    query.$or = orClauses;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    orders,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order id');
  }

  if (!status || !ORDER_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`status is required and must be one of: ${ORDER_STATUSES.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  res.json({ success: true, order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
