import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filtering, searching, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      material,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      isNewArrival,
      isBestSeller,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search keyword
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { material: { $regex: keyword, $options: 'i' } },
        { gemstone: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    // Material filter
    if (material && material !== 'all') {
      query.material = { $regex: material, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In stock
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Flags
    if (isFeatured === 'true') query.isFeatured = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isBestSeller === 'true') query.isBestSeller = true;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratingsAverage: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured, new arrivals, best sellers for home page
// @route   GET /api/products/highlights
// @access  Public
export const getHighlights = async (req, res, next) => {
  try {
    const featured = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    const newArrivals = await Product.find({ isNewArrival: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);

    const bestSellers = await Product.find({ isBestSeller: true })
      .populate('category', 'name slug')
      .sort({ ratingsAverage: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      featured,
      newArrivals,
      bestSellers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).populate('category', 'name slug description');
    }

    if (!product) {
      product = await Product.findOne({ slug: idOrSlug }).populate('category', 'name slug description');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Jewellery piece not found' });
    }

    // Get related products from the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      images,
      material,
      purity,
      weight,
      gemstone,
      dimensions,
      sizes,
      stock,
      isFeatured,
      isNewArrival,
      isBestSeller,
      certification,
    } = req.body;

    const catDoc = await Category.findById(category);
    if (!catDoc) {
      return res.status(400).json({ success: false, message: 'Invalid category selected' });
    }

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    const sku =
      'AUR-' +
      catDoc.name.substring(0, 3).toUpperCase() +
      '-' +
      Math.floor(100000 + Math.random() * 900000);

    const product = await Product.create({
      name,
      slug,
      sku,
      category: catDoc._id,
      categoryName: catDoc.name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'],
      material,
      purity: purity || '18K Gold',
      weight,
      gemstone: gemstone || 'None',
      dimensions: dimensions || '',
      sizes: Array.isArray(sizes) ? sizes : [],
      stock: Number(stock) || 1,
      isFeatured: !!isFeatured,
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
      certification: certification || 'BIS Hallmarked & GIA Certified',
    });

    // Update category item count
    await Category.findByIdAndUpdate(catDoc._id, { $inc: { itemCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.category && req.body.category !== product.category.toString()) {
      const catDoc = await Category.findById(req.body.category);
      if (catDoc) {
        req.body.categoryName = catDoc.name;
        // Decrement old category and increment new
        await Category.findByIdAndUpdate(product.category, { $inc: { itemCount: -1 } });
        await Category.findByIdAndUpdate(catDoc._id, { $inc: { itemCount: 1 } });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Category.findByIdAndUpdate(product.category, { $inc: { itemCount: -1 } });
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

