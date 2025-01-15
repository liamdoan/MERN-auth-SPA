const cors = require('cors');

const express = require('express');
const connectMongo = require('./database/connectMongo.js');
const cookieParser = require('cookie-parser');

const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin:"https://mern-auth-spa-client.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/auth.js");
const todoRoutes = require("./routes/todoRoutes.js");

app.use('/api/auth', authRoutes);
app.use('/api/todo', todoRoutes);

app.listen(PORT, () => {
    connectMongo();
    console.log(`Server is running on port ${PORT}`)
});
