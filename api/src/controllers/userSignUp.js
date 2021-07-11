'use strict';

const bcryptjs = require('bcryptjs');

const userSignUp = async (req, res) => {
  // Get the user from the request body.
  const { name, username, password } = req.body;
  // const user = req.body;

  const userObj = {
    name,
    username,
    password: bcryptjs.hashSync(password),
  };

  const collection = req.app.locals.db.collection('users');
  const result = await collection.insertOne(userObj);
  console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);

  // Set the status to 201 Created and end the response.
  return res.status(201).end();
};

module.exports = userSignUp;
