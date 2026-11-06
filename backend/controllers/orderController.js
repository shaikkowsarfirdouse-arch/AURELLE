import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      orderNotes,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No jewellery items in order' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required for white glove delivery',
      });
    }

    // Verify stock and calculate prices securely on backend
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || ''} no longer exists in our catalogue.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
        });
      }

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        image: product.images[0],
        price: product.price,
        selectedSize: item.selectedSize || '',
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Free shipping on orders over ₹999, otherwise ₹70 delivery
    const shippingPrice = itemsPrice >= 999 ? 0 : 70;

    // 3% GST calculation
    const taxPrice = Math.round(itemsPrice * 0.03 * 100) / 100;

    // Coupon discount logic
    let discountPrice = 0;
    if (couponCode) {
      const codeUpper = couponCode.trim().toUpperCase();
      if (codeUpper === 'AURELLE10') {
        discountPrice = Math.round(itemsPrice * 0.1 * 100) / 100;
      } else if (codeUpper === 'FESTIVE50') {
        discountPrice = Math.min(50, itemsPrice);
      } else if (codeUpper === 'FIRST100') {
        discountPrice = Math.min(100, itemsPrice);
      }
    }

    const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - discountPrice);

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AUR-IN-${dateStr}-${randomSuffix}`;

    const isPaid = paymentMethod === 'Credit/Debit Card' || paymentMethod === 'UPI';

    const order = await Order.create({
      user: req.user.id,
      orderNumber,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit/Debit Card',
      paymentResult: {
        id: 'PAYID-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
        status: isPaid ? 'PAID' : 'PENDING_ON_DELIVERY',
        updateTime: new Date().toISOString(),
        emailAddress: req.user.email,
      },
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountPrice,
      couponCode: couponCode || '',
      totalPrice,
      isPaid,
      paidAt: isPaid ? new Date() : null,
      orderStatus: 'Processing',
      trackingNumber: 'DELHIVERY-' + Math.floor(10000000 + Math.random() * 90000000),
      carrier: 'Delhivery / Blue Dart Express',
      orderNotes: orderNotes || '',
    });

    // Clear user's shopping cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Your jewellery order has been placed successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name slug images material');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email phone');
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure only the order owner or admin can view
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this bespoke order.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber, carrier, isPaid } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = new Date();
        order.isPaid = true;
        if (!order.paidAt) order.paidAt = new Date();
      }
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (typeof isPaid === 'boolean') {
      order.isPaid = isPaid;
      if (isPaid && !order.paidAt) order.paidAt = new Date();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

