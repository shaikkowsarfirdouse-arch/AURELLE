# AURELLE – Haute Joaillerie & Fine Diamond Jewellery E-Commerce Platform

A complete, modern, responsive, full-stack MERN jewellery e-commerce platform crafted with a premium visual identity, warm ivory & champagne palettes, gold accents, editorial product showcases, and a robust RESTful backend.

---

## 💎 Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Design System & Visual Identity](#design-system--visual-identity)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Database Schemas & Relationships](#database-schemas--relationships)
8. [REST API Documentation](#rest-api-documentation)
9. [Pre-configured Demo Credentials](#pre-configured-demo-credentials)
10. [Deployment Guide (Vercel & Render)](#deployment-guide-vercel--render)

---

## 🏛️ Architectural Overview

AURELLE is architected as an authentic, production-grade decoupled **MERN** (MongoDB, Express.js, React.js, Node.js) web application:

- **Frontend Client**: High-performance React 18 single-page application powered by Vite, Tailwind CSS with customized luxury color palettes, Lucide icons, Framer Motion transitions, and React Router DOM.
- **Backend API Server**: Node.js & Express REST API featuring JWT authentication, role-based authorization (`customer` vs `admin`), bcrypt password hashing, Multer + Cloudinary image processing, input validation, and centralized error handling.
- **Database Layer**: MongoDB via Mongoose ORM featuring 7 core collections with relational referencing, automated rating aggregation, and zero-configuration development fallback.

---

## ✨ Design System & Visual Identity

The platform adheres to an uncompromising luxury aesthetic inspired by European fine jewellery maisons and traditional high joaillerie:

- **Background Palettes**: Ivory (`#FAF6F0`, `#FCFAF6`), Warm Champagne (`#EBDDCB`, `#F5EFE6`).
- **Metallic Gold Accents**: Signature Aurelle Gold (`#C29F41`, `#D4B866`, `#A4802E`).
- **Typography & Dark Contrast**: Deep Charcoal / Noir (`#171412`, `#0C0A09`), Warm Taupe (`#786E65`).
- **Editorial Typography**: 
  - Headings: *Cormorant Garamond* (Classical Serif with high contrast and graceful italics).
  - Body & UI: *Plus Jakarta Sans* (Crisp, modern, high-legibility sans-serif).
- **Interactions**: Smooth hover zoom on editorial product photography, multi-image hover swaps, quick-view inspection modal, sliding shopping bag drawer, and courier tracking stepper.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite)
- **Styling**: Tailwind CSS, Custom Luxury CSS Variables & Utilities
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with automatic JWT Bearer interceptors
- **Animation**: Framer Motion & CSS keyframe transitions

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Media / Assets**: Cloudinary SDK & Multer memory storage
- **CORS & Environment**: CORS, Dotenv

---

## 📁 Folder Structure

```
AURELLE/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection & local in-memory fallback
│   │   └── cloudinary.js         # Cloudinary configuration & upload pipeline
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile management
│   │   ├── productController.js  # Search, filter, pagination, CRUD
│   │   ├── categoryController.js # Category / Collection management
│   │   ├── cartController.js     # Server-synced shopping cart operations
│   │   ├── wishlistController.js # Saved wishlist toggle & synchronization
│   │   ├── orderController.js    # Order checkout, price validation, tracking
│   │   ├── reviewController.js   # Customer ratings, reviews & aggregation
│   │   ├── adminController.js    # Metrics, analytics, customer management
│   │   └── uploadController.js   # Image upload handling to Cloudinary
│   ├── data/
│   │   ├── categoriesData.js     # Curated jewellery category definitions
│   │   ├── productsData.js       # Curated high-resolution jewellery pieces
│   │   └── seed.js               # Database seeding script
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification & adminOnly guard
│   │   └── errorMiddleware.js    # 404 handler and Mongoose error sanitizer
│   ├── models/
│   │   ├── User.js               # Customer & Admin accounts with bcrypt
│   │   ├── Product.js            # Jewellery items, specs, pricing, stock
│   │   ├── Category.js           # Collections (Necklaces, Rings, Earrings, etc.)
│   │   ├── Cart.js               # User bag items with sizes & snapshot prices
│   │   ├── Wishlist.js           # Saved creations array
│   │   ├── Order.js              # Complete order dossier, items, address, status
│   │   └── Review.js             # Client commendations with star ratings
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server bootstrap & health check
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios instance, interceptors, typed API endpoints
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state, login, register, logout
│   │   │   ├── CartContext.jsx   # Cart drawer, quantity, vouchers, total math
│   │   │   └── WishlistContext.jsx # Wishlist persistence & toggle helpers
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── AnnouncementBar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── SearchModal.jsx
│   │   │   │   ├── QuickViewModal.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── FeaturedCategories.jsx
│   │   │   │   ├── ProductCarousel.jsx
│   │   │   │   ├── BrandStory.jsx
│   │   │   │   ├── LookbookBanner.jsx
│   │   │   │   ├── CustomerTestimonials.jsx
│   │   │   │   └── Newsletter.jsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   ├── ImageGallery.jsx
│   │   │   │   └── ProductReviews.jsx
│   │   │   ├── cart/
│   │   │   │   └── CartDrawer.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── ProductModal.jsx
│   │   │       └── CategoryModal.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CataloguePage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.jsx
│   │   │       ├── AdminProductsPage.jsx
│   │   │       ├── AdminCategoriesPage.jsx
│   │   │       ├── AdminOrdersPage.jsx
│   │   │       └── AdminCustomersPage.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                  # Root runner scripts
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18+ or v20+ LTS
- **npm** v9+

### 1. Clone & Install Dependencies

In the root directory, install dependencies for both backend and frontend:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create `.env` inside `backend/`:

```bash
cd backend
cp .env.example .env
```

*(Edit `.env` if you wish to connect an external MongoDB Atlas cluster or Cloudinary account; leaving `MONGODB_URI` blank uses the automatic local development fallback).*

### 3. Run the Backend Server

```bash
cd backend
npm run dev
# Or: npm start
```
*The server will start on `http://localhost:5000` and automatically seed the initial catalogue if the database is empty.*

### 4. Run the Frontend Development Server

In a second terminal:

```bash
cd frontend
npm run dev
```
*Open your browser at `http://localhost:5173` to explore AURELLE.*

---

## 🔐 Pre-configured Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Maison Director (Admin)** | `admin@aurelle.com` | `admin123` | Full access to `/admin` dashboard, inventory, orders, analytics, and user privileges |
| **Private Collector (Customer)** | `customer@aurelle.com` | `customer123` | Client access to portfolio, wishlist, past orders, and checkout |

*Note: The Login page includes 1-click quick credentials buttons for instant demonstration.*

### Available Promotional Codes for Checkout
- `AURELLE10`: 10% Exclusive Privilège discount
- `ROYAL50`: $50 Bespoke voucher
- `NOIR20`: 20% High Jewellery Gala privilege

---

## 📊 Database Schemas & Relationships

1. **User**: Name, email, hashed password, role (`customer` | `admin`), phone, residence address.
2. **Product**: Name, slug, SKU, category (ref `Category`), price, originalPrice, images array, material, weight, purity, gemstone, sizes array, stock, ratingsAverage, numReviews, isFeatured, isNewArrival, isBestSeller.
3. **Category**: Name, slug, description, image, displayOrder, itemCount.
4. **Cart**: User (ref `User`), items array with product (ref `Product`), quantity, selectedSize, price.
5. **Wishlist**: User (ref `User`), products array (refs `Product`).
6. **Order**: User (ref `User`), orderNumber, orderItems array, shippingAddress, paymentMethod, paymentResult, itemsPrice, taxPrice, shippingPrice, discountPrice, totalPrice, isPaid, orderStatus (`Pending` | `Processing` | `Shipped` | `Delivered` | `Cancelled`), trackingNumber, carrier.
7. **Review**: Product (ref `Product`), user (ref `User`), userName, rating (1–5), title, comment, verifiedPurchase.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update contact details, residence, password |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Filter, search, sort, and paginate pieces |
| `GET` | `/api/products/highlights` | Public | Get featured, new arrivals, best sellers |
| `GET` | `/api/products/:idOrSlug` | Public | Single piece details & related creations |
| `POST` | `/api/products` | Admin | Create new jewellery creation |
| `PUT` | `/api/products/:id` | Admin | Update creation specifications |
| `DELETE`| `/api/products/:id` | Admin | Retire creation from boutique |

### Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | List all categories sorted by displayOrder |
| `GET` | `/api/categories/:slug` | Public | Category details and associated pieces |
| `POST` | `/api/categories` | Admin | Create new jewellery collection |
| `PUT` | `/api/categories/:id` | Admin | Update collection |
| `DELETE`| `/api/categories/:id` | Admin | Delete empty collection |

### Cart & Wishlist (`/api/cart`, `/api/wishlist`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Private | Retrieve active shopping bag |
| `POST` | `/api/cart` | Private | Add piece with quantity & selected size |
| `PUT` | `/api/cart/item/:itemId` | Private | Update piece quantity |
| `DELETE`| `/api/cart/item/:itemId` | Private | Remove piece from bag |
| `DELETE`| `/api/cart` | Private | Clear entire bag |
| `GET` | `/api/wishlist` | Private | Get saved wishlist creations |
| `POST` | `/api/wishlist/toggle` | Private | Toggle piece in/out of wishlist |
| `DELETE`| `/api/wishlist/:id` | Private | Remove piece from wishlist |

### Orders & Admin (`/api/orders`, `/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Create order, deduct stock, empty bag |
| `GET` | `/api/orders/myorders` | Private | Get logged-in user order history |
| `GET` | `/api/orders/:id` | Private | Get order dossier by ID or OrderNumber |
| `GET` | `/api/orders` | Admin | List all orders with status filter |
| `PUT` | `/api/orders/:id/status`| Admin | Update order status & courier tracking |
| `GET` | `/api/admin/stats` | Admin | Atelier sales valuation, orders, inventory |
| `GET` | `/api/admin/users` | Admin | List registered collectors & orders |
| `PUT` | `/api/admin/users/:id/role`| Admin | Toggle collector vs Director privileges |

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your repository to GitHub.
2. In the Vercel Dashboard, import the repository and set the **Root Directory** to `frontend`.
3. Build Settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://aurelle-backend.onrender.com/api`)

### Backend Deployment (Render)
1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Build & Start Commands:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection URI (`mongodb+srv://...`)
   - `JWT_SECRET`: A secure 64-character random string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `FRONTEND_URL`: Your Vercel frontend URL

