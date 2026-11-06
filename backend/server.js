import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Initial seed helper
import Product from './models/Product.js';
import { seedData } from './data/seed.js';

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*', // Allow frontend development server & deployments
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Root Welcome Route & Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Welcome to AURELLE Haute Joaillerie & Indian Fashion Jewellery API',
    brand: 'AURELLE',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      auth: '/api/auth/login',
    },
    frontendNotice: 'This is the backend API service. For the customer website, visit your Vercel deployment.',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    brand: 'AURELLE Indian Fashion Jewellery',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Reseed Catalogue Route
app.post('/api/seed', async (req, res) => {
  try {
    await seedData(false);
    res.status(200).json({ success: true, message: 'Indian Fashion Jewellery catalogue reseeded successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed initial catalog if products collection is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[AURELLE] Database is empty. Seeding initial luxury catalogue...');
      await seedData(false);
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`✨ AURELLE Haute Joaillerie Server running on port ${PORT}`);
      console.log(`   Health API: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

