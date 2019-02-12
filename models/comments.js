const knex = require('../db/connection');

exports.getCommentsByArticle = (knexQuery) => {
  const {
    limit = 10,
    page = 1,
    sort = 'asc',
    sort_criteria = 'created_at',
    ...remainingQuery
  } = knexQuery;
  const remaining = { ...remainingQuery };

  return knex('comments')
    .select('*')
    .where(remaining);
};

// knex('comments')
// .where(remaining)
// .count({ comment_count: 'comments.comment_id' })
