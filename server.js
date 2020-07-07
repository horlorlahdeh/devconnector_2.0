const express = require('express');
const connectDB = require('./config/db');
const { connect } = require('mongoose');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Server Running'));

// Define Routes
const usersRoute = require('./routes/api/users');
const profileRoute = require('./routes/api/profile');
const postsRoute = require('./routes/api/posts');
const authRoute = require('./routes/api/auth');

// User Routes by calling them with express
app.use('/api/users', usersRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));
