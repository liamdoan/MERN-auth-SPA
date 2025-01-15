const cors = require('cors');

const express = require('express');
const connectMongo = require('./database/connectMongo.js');
const cookieParser = require('cookie-parser');

const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;

// app.use(cors({
//     origin: process.env.DEVELOPMENT_CLIENT_URL,
//     credentials: true
// }));

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://mern-auth-spa-client.vercel.app',
            'http://localhost:5173',
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.options('*', (req, res) => {
    const allowedOrigins = [
        'https://mern-auth-spa-client.vercel.app',
        'http://localhost:5173',
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).end();
    } else {
        res.status(403).end();
    }
});

const authRoutes = require("./routes/auth.js");
const todoRoutes = require("./routes/todoRoutes.js");

app.use('/api/auth', authRoutes);
app.use('/api/todo', todoRoutes);

app.listen(PORT, () => {
    connectMongo();
    console.log(`Server is running on port ${PORT}`)
});
