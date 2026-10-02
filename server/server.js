const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const heroSlideRoutes = require('./routes/heroSlideRoutes');

const app = express();

// CORS - only allow the configured client origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded product images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'NB CLASSIC SCENTS API is running', timestamp: new Date().toISOString() });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hero-slides', heroSlideRoutes);

// In production, serve the built React app from the same service/origin
// (client/dist produced by `npm run build` in client/) so only one deployed
// URL and no CORS setup is needed. API routes above still take precedence;
// any other path falls through to the SPA's index.html for client routing.
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start accepting requests.
// connectDB() itself logs a clear error and process.exit(1)s on failure.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`NB CLASSIC SCENTS server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

module.exports = app;
