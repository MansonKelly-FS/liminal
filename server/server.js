const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const passport = require("./passport"); 
const session = require("express-session");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes)

const folderRoutes = require("./routes/folders");
app.use("/api", folderRoutes);

const fileRoutes = require("./routes/files");
app.use("/api", fileRoutes);

const searchRoutes = require("./routes/search");
app.use("/api", searchRoutes);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
