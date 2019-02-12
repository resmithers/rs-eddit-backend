const knex = require('../db/connection');

exports.fetchArticles = (knexQuery) => {
  const {
    limit = 10,
    page = 1,
    sort = 'asc',
    sort_criteria = 'articles.created_at',
    ...remainingQuery
  } = knexQuery;
  const remaining = { ...remainingQuery };

  return Promise.all([
    knex('articles')
      .select('articles.*')
      .where(remaining)
      .leftJoin('comments', 'comments.article_id', 'articles.article_id')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(sort_criteria, sort)
      .groupBy('articles.article_id')
      .count({ comment_count: 'comments.comment_id' }),
    knex('articles')
      .where(remaining)
      .count({ total_articles: 'articles.article_id' })]);
};


exports.fetchArticleByID = ({ article_id }) => {
  return knex('articles')
    .select('articles.*')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .where({ 'articles.article_id': article_id })
    .groupBy('articles.article_id')
    .count({ comment_count: 'comments.comment_id' });
};

exports.insertArticle = (articleData) => {
  return knex('articles')
    .insert(articleData)
    .returning('*')
    .catch(console.error);
};

exports.updateArticle = (updateData, article_id) => {
  return knex('articles')
    .where({ article_id })
    .update(updateData)
    .returning('*')
    .catch(console.error);
};

exports.deleteArticle = (article_id) => {
  return knex('articles')
    .where({ article_id })
    .delete()
    .catch(console.error);
};
