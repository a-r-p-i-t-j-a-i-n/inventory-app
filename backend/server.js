const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const path = require('path');
const fs = require('fs');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const stockRoutes = require('./src/routes/stockRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Headers - Relaxed for simple SPA deployment
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Global Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 10 minutes',
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Data Sanitization against XSS
app.use(xss());

// CORS
app.use(cors());

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
try {
    const swaggerDocument = YAML.load('./swagger.yaml');
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.error('Swagger Load Error:', error.message);
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);

// Serve Frontend Static Files (Production)
if (process.env.NODE_ENV === 'production') {
    // Robust resolution: backend is running from /backend folder, so frontend is ../frontend
    // Using process.cwd() is safer in some container envs
    const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

    console.log(`Checking for frontend build at: ${frontendDistPath}`);

    if (fs.existsSync(frontendDistPath)) {
        app.use(express.static(frontendDistPath));

        // Unknown route? Serve index.html for SPA
        app.get('*', (req, res) => {
            const indexPath = path.join(frontendDistPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                console.error('Missing index.html!');
                res.status(500).send('Server Error: index.html not found. Build likely failed.');
            }
        });
    } else {
        console.error('Frontend dist folder missing!');
        app.get('*', (req, res) => {
            res.status(500).send('Server Error: Frontend build missing. Please run "npm run build-client".');
        });
    }
} else {
    app.get('/', (req, res) => {
        res.send('API is running... (Dev Mode)');
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
