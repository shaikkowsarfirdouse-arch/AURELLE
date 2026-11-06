import dotenv from 'dotenv';
import connectDB, { closeDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import { categories } from './categoriesData.js';
import { products } from './productsData.js';

dotenv.config();

export const seedData = async (shouldExit = false) => {
  try {
    console.log('--- Seeding AURELLE Indian Fashion Jewellery Catalogue ---');

    // Clear collections
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    console.log('✔ Cleared existing collections');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Aurelle Store Manager',
      email: 'admin@aurelle.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98200 12345',
      address: {
        street: 'Shop 14, Commercial Plaza, Linking Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
      },
    });

    const customerUser = await User.create({
      name: 'Priya Sharma',
      email: 'customer@aurelle.com',
      password: 'customer123',
      role: 'customer',
      phone: '+91 98765 43210',
      address: {
        street: 'Flat 402, Sunshine Heights, 14th Cross, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
    });

    console.log(`✔ Created Users: Admin (${adminUser.email}) & Customer (${customerUser.email})`);

    // 2. Create Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✔ Created ${createdCategories.length} Categories`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat;
    });

    // 3. Create Products
    const productsToInsert = products.map((prod) => {
      const cat = categoryMap[prod.categorySlug] || createdCategories[0];
      const { categorySlug, ...rest } = prod;
      return {
        ...rest,
        category: cat._id,
        categoryName: cat.name,
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✔ Created ${createdProducts.length} Fashion Jewellery Products`);

    for (const cat of createdCategories) {
      const count = await Product.countDocuments({ category: cat._id });
      cat.itemCount = count;
      await cat.save();
    }

    // 4. Sample Reviews (Simple, everyday friendly language)
    const sampleReviews = [
      {
        product: createdProducts[0]._id,
        user: customerUser._id,
        userName: customerUser.name,
        rating: 5,
        title: 'Loved the quality of this Kundan choker set!',
        comment: 'Wore it for my cousin\'s wedding sangeet and received so many compliments! The gold polish looks so real and the dori is easy to adjust. Fast delivery in beautiful safe packaging.',
        verifiedPurchase: true,
      },
      {
        product: createdProducts[4]._id,
        user: customerUser._id,
        userName: customerUser.name,
        rating: 5,
        title: 'Very light on the ears and super pretty!',
        comment: 'These temple jhumkas are surprisingly lightweight. I wore them for 6 hours straight without any pain. The pearls and filigree bell carving are very neat.',
        verifiedPurchase: true,
      },
      {
        product: createdProducts[12]._id,
        user: customerUser._id,
        userName: customerUser.name,
        rating: 5,
        title: 'Perfect fit and rich gold look kada bangles',
        comment: 'The side screw makes it so easy to put on. The finishing looks like real gold jewellery. Great value for ₹699.',
        verifiedPurchase: true,
      },
    ];

    await Review.insertMany(sampleReviews);
    console.log(`✔ Created customer reviews`);

    // 5. Sample Customer Orders (in ₹ INR)
    const sampleOrder1 = await Order.create({
      user: customerUser._id,
      orderNumber: 'AUR-IN-202611-1042',
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          quantity: 1,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          selectedSize: 'Free Size (Adjustable Dori)',
        },
      ],
      shippingAddress: {
        fullName: customerUser.name,
        email: customerUser.email,
        phone: customerUser.phone,
        street: customerUser.address.street,
        city: customerUser.address.city,
        state: customerUser.address.state,
        postalCode: customerUser.address.postalCode,
        country: customerUser.address.country,
      },
      paymentMethod: 'Credit/Debit Card',
      paymentResult: {
        id: 'PAYID-AUR-984210',
        status: 'PAID',
        updateTime: new Date().toISOString(),
        emailAddress: customerUser.email,
      },
      itemsPrice: 1499,
      taxPrice: 45,
      shippingPrice: 0,
      discountPrice: 150,
      couponCode: 'AURELLE10',
      totalPrice: 1394,
      isPaid: true,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderStatus: 'Shipped',
      trackingNumber: 'DELHIVERY-AUR-90142',
      carrier: 'Delhivery Express Courier',
      orderNotes: 'Please deliver after 2 PM.',
    });

    const sampleOrder2 = await Order.create({
      user: customerUser._id,
      orderNumber: 'AUR-IN-202611-0985',
      orderItems: [
        {
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          quantity: 1,
          image: createdProducts[3].images[0],
          price: createdProducts[3].price,
          selectedSize: 'One Size',
        },
      ],
      shippingAddress: {
        fullName: customerUser.name,
        email: customerUser.email,
        phone: customerUser.phone,
        street: customerUser.address.street,
        city: customerUser.address.city,
        state: customerUser.address.state,
        postalCode: customerUser.address.postalCode,
        country: customerUser.address.country,
      },
      paymentMethod: 'Cash on Delivery',
      paymentResult: {
        id: 'COD-PENDING',
        status: 'PENDING_ON_DELIVERY',
        updateTime: new Date().toISOString(),
        emailAddress: customerUser.email,
      },
      itemsPrice: 499,
      taxPrice: 15,
      shippingPrice: 70,
      discountPrice: 0,
      totalPrice: 584,
      isPaid: true,
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      orderStatus: 'Delivered',
      trackingNumber: 'BLUEDART-AUR-88219',
      carrier: 'Blue Dart Courier',
      deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    console.log(`✔ Created ${[sampleOrder1, sampleOrder2].length} Sample Indian Orders`);

    // 6. Prepopulate Wishlist
    await Wishlist.create({
      user: customerUser._id,
      products: [createdProducts[1]._id, createdProducts[4]._id],
    });
    console.log(`✔ Prepopulated Wishlist`);

    console.log('--- Seed Completed Successfully! ---');

    if (shouldExit) {
      await closeDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during database seed:', error);
    if (shouldExit) {
      process.exit(1);
    }
  }
};

if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedData(true);
  })();
}
