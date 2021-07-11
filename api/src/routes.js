'use strict';

const express = require('express');
const { ObjectID } = require('mongodb');
// Construct a router instance.
const router = express.Router();

// middlewares
const validateUser = require('./middlewares/userSignUp.validator');
const authenticateUser = require('./middlewares/userSignIn.authenticate');

// controllers
const userSignUp = require('./controllers/userSignUp');
const userSignIn = require('./controllers/userSignIn');
const userSignOut = require('./controllers/userSignOut');


// POST /signup
router.post('/users', validateUser, userSignUp);
// GET /signin
router.get('/users', authenticateUser, userSignIn);
// GET /signout
router.get('/signout', userSignOut);
// dashboard
router.get('/dashboard', async (req, res, next) => {
  console.log(req.session.userId);
  try {
    if (req.session.userId) {
      const collection = req.app.locals.db.collection('users');
      const user = await collection.findOne({ _id: ObjectID(req.session.userId) });
      res.json({ username: user.username });
    } else {
      res.status(401).json({ message: 'Not signed in' });
    }
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
