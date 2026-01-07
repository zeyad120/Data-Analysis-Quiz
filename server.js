const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
    origin: [
        'https://zeyad120.github.io',
        'http://localhost:3000',
        'https://website-2-nu-blue.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key', // In production, use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
    }
}));

// In-memory storage (in a real app, use a database)
let quizResults = [];

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'zeyadmogy20',
    password: '1882005da'
};

// Middleware to check admin authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized. Please log in to access this resource.' });
};

// API Routes

// Submit quiz results
app.post('/api/submit-quiz', (req, res) => {
    const { username, chapter, score, answers } = req.body;
    
    if (!username || !chapter || score === undefined || !answers) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const submission = {
        id: Date.now(),
        username: username.trim(),
        chapter: chapter.trim(),
        score: parseFloat(score),
        answers,
        timestamp: new Date().toISOString()
    };
    
    quizResults.push(submission);
    res.status(201).json({ 
        success: true,
        message: 'Quiz submitted successfully', 
        submission 
    });
});

// Get all quiz results (admin only)
app.get('/api/results', isAuthenticated, (req, res) => {
    res.json(quizResults);
});

// Check admin session
app.get('/api/admin/check', (req, res) => {
    res.json({
        isAuthenticated: !!req.session.isAuthenticated
    });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        req.session.isAuthenticated = true;
        res.json({ 
            success: true,
            message: 'Login successful' 
        });
    } else {
        res.status(401).json({ 
            success: false,
            error: 'Invalid username or password' 
        });
    }
});

// Check admin session
app.get('/api/admin/check', (req, res) => {
    res.json({ 
        isAuthenticated: !!req.session.isAuthenticated,
        message: req.session.isAuthenticated ? 'Session is active' : 'No active session'
    });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.clearCookie('connect.sid');
        res.json({ 
            success: true, 
            message: 'Successfully logged out' 
        });
    });
});

// Serve HTML pages
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chapters', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chapters.html'));
});

app.get('/quiz/:chapter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Server configuration for both local and Vercel deployment
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the Express API for Vercel
module.exports = app;
