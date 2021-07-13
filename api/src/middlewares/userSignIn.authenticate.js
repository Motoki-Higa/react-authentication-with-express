'use strict';

const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// authenticate the request using Basic Authentication.
const authenticateUser = async (req, res, next) => {
  let message = null;

  // Get the user's credentials from the Authorization header,
  // and parse it to 'name' and 'pass' object
  const credentials = auth(req);

  if (credentials) {
    // Look for a user whose `username` matches the credentials `name` property.
    const collection = req.app.locals.db.collection('users');
    const user = await collection.findOne({ username: credentials.name });


    if (user) {
      // bcryptjs.compareSync(): second argument hashes the user password to compare with already hashed password from db
      // return true if authenticated
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);

        // store the user object in session
        req.session.userId = user._id;
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
    console.log(message);
    res.status(401).json({ message: [message] });
  } else {
    next();
  }
};

module.exports = authenticateUser;
