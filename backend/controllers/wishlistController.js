import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'products',
      select: 'name slug price originalPrice images material stock gemstone isFeatured',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    // Filter out nulls in case product was deleted
    wishlist.products = wishlist.products.filter((p) => p !== null);

    res.status(200).json({
      success: true,
      wishlist: wishlist.products,
      count: wishlist.products.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in/out of wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    const index = wishlist.products.findIndex(
      (p) => p.toString() === productId
    );

    let added = false;
    if (index > -1) {
      wishlist.products.splice(index, 1);
      added = false;
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price originalPrice images material stock gemstone isFeatured',
    });

    res.status(200).json({
      success: true,
      added,
      message: added ? 'Added to your Wishlist' : 'Removed from your Wishlist',
      wishlist: populatedWishlist.products,
      count: populatedWishlist.products.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price originalPrice images material stock gemstone isFeatured',
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from Wishlist',
      wishlist: populatedWishlist.products,
      count: populatedWishlist.products.length,
    });
  } catch (error) {
    next(error);
  }
};

