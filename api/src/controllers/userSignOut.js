'use strict';

const userSignOut = async (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        throw Error('Could not sign out');
      } else {
        res.send({ message: 'Your session is ended' });
      }
    });
  }
};

module.exports = userSignOut;
