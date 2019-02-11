const {
  articleData, topicData, userData, commentData,
} = require('../index');

const { formatArticleData, getLookup, formatCommentData } = require('../../utils');

exports.seed = function (knex, Promise) {
  return knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => Promise.all([knex('topics').insert(topicData).returning('*'), knex('users').insert(userData).returning('*')]))
    .then(([topicRows, userRows]) => {
      const formattedArticleData = formatArticleData(articleData);
      return Promise.all([knex('articles').insert(formattedArticleData).returning('*'), userRows, topicRows]);
    })
    .then(([articleRows, userRows, topicRows]) => {
      const lookup = getLookup(articleRows, 'article_id', 'title');
      // console.log(lookup);
      const formattedCommentData = formatCommentData(commentData, lookup);
      return Promise.all([knex('comments').insert(formattedCommentData).returning('*'), articleRows, userRows, topicRows]);
    })
    .then(([commentRows, articleRows, userRows, topicRows]) => {
      // console.log(commentRows);
    })
    .catch(console.error);
};
