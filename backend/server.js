require('dotenv').config();

// ==================== IMPORTS ====================
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');

// Route modules
const authRoutes = require('./routes/authRoute');
const resetRoutes = require('./routes/resetRoute');
const productRoutes = require('./routes/inventoryRoute'); // Renamed variable for clarity
const blogRoutes = require('./routes/blogRoute');
const testimonialsRoutes = require('./routes/testimonialRoute');
const dashboardRoutes = require('./routes/dashboardRoute');
const chatbotRoutes = require('./routes/chatBotRoute');
const configRoutes = require('./routes/configRoute');

// ==================== APP SETUP ====================
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const FRONTEND_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://thriftstore.co.ke'
  : 'http://localhost:5173';

app.set('trust proxy', 1); // Required for Render/Heroku rate limiting & IP detection

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true // Allows cookies to be sent cross-origin
}));

app.use(express.json());
app.use(cookieParser());

// ==================== STATIC FILES ====================
// Serve uploaded images with CORS headers so the frontend <img> tags can read them
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Serve the built React frontend in production
app.use(express.static(path.join(__dirname, 'public')));

// ==================== API ROUTES ====================
// Public routes
app.use('/api', authRoutes);              // /api/register, /api/login, /api/logout, /api/profile
app.use('/api/reset', resetRoutes);
app.use('/api/products', productRoutes);  // Changed from /api/inventory to match frontend
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/config', configRoutes);

// Protected dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ==================== ERROR HANDLING ====================

// 1. Catch-all for unmatched API routes (returns JSON, not React HTML)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// 2. Client-side routing catch-all (sends React index.html for any other route)
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

// 3. Global Error Handler (Handles Multer upload errors + general server errors)
app.use((err, req, res, next) => {
  // Handle Multer specific errors (File too large, wrong format, etc.)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      message: `Upload Error: ${err.message}`,
      field: err.field 
    });
  }
  
  // Handle custom file filter errors
  if (err.message && err.message.includes('Only images')) {
    return res.status(400).json({ message: err.message });
  }

  // Handle everything else
  console.error('❌ Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ==================== START SERVER ====================
// Connect to MongoDB first, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`🌍 Accepting requests from: ${FRONTEND_ORIGIN}`);
  });
});