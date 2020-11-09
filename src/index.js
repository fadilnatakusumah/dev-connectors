const express = require('express');
const morgan = require('morgan');
const path = require('path');

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


// serve static asssets to production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))
}

app.listen(PORT, () => console.info(`Server running on port ${PORT}`))