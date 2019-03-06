const knex = require('../db/connection');

exports.getCommentsByArticle = (knexQuery, article_id) => {
  const {
    limit = 10,
    p = 1,
    order = 'desc',
    sort_by = 'created_at',
    ...remainingQuery
  } = knexQuery;
  const remaining = { article_id, ...remainingQuery };

  return knex('comments')
    .select('*')
    .where(remaining)
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, order);
};

exports.postCommentByArticle = (article_id, new_comment) => {
  const { author, body } = new_comment;
  return knex('comments')
    .insert({ article_id, author, body })
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
