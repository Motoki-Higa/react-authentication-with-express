'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
// Construct a router instance.
const router = express.Router();

// This array is used to keep track of user records
// as they are created.
// In real case, this would be the database
const users = [];


// ================= Custom middleware =================
// authenticate the request using Basic Authentication.
const authenticateUser = (req, res, next) => {
  let message = null;

  // Get the user's credentials from the Authorization header, and parse it to 'name' and 'pass' object
  const credentials = auth(req);

  if (credentials) {
    // Look for a user whose `username` matches the credentials `name` property.
    const user = users.find(u => u.username === credentials.name);

    if (user) {
      // bcryptjs.compareSync(): second argument hashes the user password to compare with already hashed password from db
      // return true if authenticated
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};
// =====================================================


// Route that returns the current authenticated user.
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;

  res.json({
    name: user.name,
    username: user.username,
  });
});


// ================= Custom middleware =================
// validate the request body with express-validator(npm).
const validateUser = [
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check('username')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "username"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
];
// =====================================================


// Route that creates a new user.
router.post('/users', validateUser, (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  }

  // Get the user from the request body.
  const user = req.body;

  // Hash the new user's password.
  user.password = bcryptjs.hashSync(user.password);

  // Add the user to the `users` array.
  users.push(user);

  // Set the status to 201 Created and end the response.
  return res.status(201).end();
});

module.exports = router;
