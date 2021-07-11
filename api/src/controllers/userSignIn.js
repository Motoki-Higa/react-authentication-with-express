'use strict';

const userSignIn = async (req, res) => {
  console.log(req.session.userId);
  const user = req.currentUser;

  res.json({
    name: user.name,
    username: user.username,
  });
};

module.exports = userSignIn;
