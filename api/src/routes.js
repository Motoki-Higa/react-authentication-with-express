'use strict';

const express = require('express');
const { ObjectID } = require('mongodb');
// Construct a router instance.
const router = express.Router();

// middlewares
const requiresSignin = require('./middlewares/requiresSignin');
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
router.get('/dashboard', requiresSignin, async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection('users');
    const user = await collection.findOne({ _id: ObjectID(req.session.userId) });
    res.json({ username: user.username });
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
