'use strict';

// authenticate the request using Basic Authentication.
const requiresSignin = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: 'You mush sign in to view this page.' });
};

module.exports = requiresSignin;
