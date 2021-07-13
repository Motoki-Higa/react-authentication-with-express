'use strict';

const cors = require('cors');
const express = require('express');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const routes = require('./src/routes');
require('dotenv').config();

// Create the Express app.
const app = express();

// Enable CORS Requests from the front-end
const corsOptions = {
  origin: 'http://localhost:3000', // Your Client, do not write '*'
  credentials: true,
};
app.use(cors(corsOptions));


// ================ mongoDB atlas config ==================
// Connection URL & Database Name
const uri = process.env.DB_CONNECTION;
const dbName = process.env.DB_NAME;
MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, client) => {
  const db = client.db(dbName);
  // store db in app.locals gloablly
  app.locals.db = db;
});
// =========================================================


// ============ use sessions for tracking logins ===========
// if 'store' is not defined, then express-session uses a default session store within express
// which is slow if multiple users login
app.use(session({
  secret: 'cracking the code',
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONNECTION,
    dbName: process.env.DB_NAME,
  }),
  resave: true,
  saveUninitialized: false,
}));
// =========================================================


// Setup request body JSON parsing.
app.use(express.json());

// Setup morgan which gives us HTTP request logging.
app.use(morgan('dev'));

// Setup a friendly greeting for the root route.
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API Authentication with Express project!',
  });
});

// Add routes.
app.use('/api', routes);

// Send 404 if no other route matched.
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup a global error handler.
app.use((err, req, res, next) => {
  console.error(`Global error handler: ${JSON.stringify(err.stack)}`);

  res.status(500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Set our port.
app.set('port', process.env.PORT || 5000);

// Start listening on our port.
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
