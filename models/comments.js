const knex = require('../db/connection');

exports.getCommentsByArticle = (knexQuery, article_id) => {
  const {
    limit = 10,
    page = 1,
    sort = 'asc',
    sort_criteria = 'created_at',
    ...remainingQuery
  } = knexQuery;
  const remaining = { article_id, ...remainingQuery };

  return knex('comments')
    .select('*')
    .where(remaining)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(sort_criteria, sort);
};

exports.postCommentByArticle = (article_id, new_comment) => {
  const { username, body } = new_comment;
  return knex('comments')
    .insert({ article_id, author: username, body })
    .returning('*');
};

exports.updateComment = ({ inc_votes }, comment_id) => {
  return knex('comments')
    .where({ comment_id })
    .increment('votes', inc_votes)
    .returning('*');
};

exports.deleteCommentID = (comment_id) => {
  return knex('comments')
    .where({ comment_id })
    .delete();
};
