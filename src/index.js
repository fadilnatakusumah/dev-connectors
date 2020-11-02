const express = require('express');
const morgan = require('morgan')

const connectDB = require('../config/db');

const PORT = process.env.PORT || 5000;
const app = express();

// connectDB
connectDB();

// init middleware
app.use(express.json())
app.use(morgan('dev'));

const apiRoutes = require('../routes/api');

app.use('/api', apiRoutes);

app.get('/', (req, res) => res.send("API RUNNING"))

app.listen(PORT, () => console.info(`Server running on port ${PORT}`))