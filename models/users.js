const knex = require('../db/connection');

exports.fetchUsers = () => {
  return knex('users').select('*');
};

exports.insertUser = (userData) => {
  return knex('users')
    .insert(userData)
    .returning('*')
    .catch(console.error);
};

exports.fetchUserByID = (username) => {
  return knex('users')
    .select('*')
    .where({ username });
};
