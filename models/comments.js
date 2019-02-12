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

// knex('comments')
// .where(remaining)
// .count({ comment_count: 'comments.comment_id' })


exports.deleteCommentsByArticleID = (article_id) => {
  return knex('comments')
    .where({ article_id })
    .delete();
};
