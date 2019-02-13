const knex = require('../db/connection');

exports.fetchTopics = () => {
  return knex('topics').select('*');
};

exports.insertTopic = (topicData) => {
  return knex('topics')
    .insert(topicData)
    .returning('*');
};
