const cors = require('cors');

const express = require('express');
const connectMongo = require('./database/connectMongo.js');
const cookieParser = require('cookie-parser');
const path = require("path");

const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({
    origin: process.env.DEVELOPMENT_CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/auth.js");
const todoRoutes = require("./routes/todoRoutes.js");

app.use('/api/auth', authRoutes);
app.use('/api/todo', todoRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    connectMongo();
    console.log(`Server is running on port ${PORT}`)
});
