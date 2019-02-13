const { fetchUsers, insertUser, fetchUserByID } = require('../models');

exports.sendUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

exports.addUser = (req, res, next) => {
  insertUser(req.body)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404 });
      return res.status(201).send({ user });
    })
    .catch(next);
};

exports.sendUser = (req, res, next) => {
  fetchUserByID(req.params.username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404 });
      return res.send({ user });
    })
    .catch(next);
};
