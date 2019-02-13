const { fetchUsers, insertUser, fetchUserByID } = require('../models');

exports.sendUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch(console.error);
};

exports.addUser = (req, res, next) => {
  insertUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(console.error);
};

exports.sendUser = (req, res, next) => {
  fetchUserByID(req.params.username)
    .then(([user]) => {
      res.send({ user });
    })
    .catch(console.error);
};
