const knex = require('../db/connection');

exports.fetchArticles = ({
  limit = 10,
  p = 1,
  order = 'desc',
  sort_by = 'created_at',
  article_id,
  author,
  ...a
}) => {
  const remaining = { ...a };
  if (author) remaining['articles.author'] = author;
  if (article_id) remaining['articles.article_id'] = article_id;
  if (sort_by) sort_by = [sort_by === 'comment_count' ? sort_by : `articles.${sort_by}`];

  return Promise.all([
    knex('articles')
      .select('articles.*')
      .where(remaining)
      .leftJoin('comments', 'comments.article_id', 'articles.article_id')
      .count({ comment_count: 'comments.comment_id' })
      .groupBy('articles.article_id')
      .orderBy(sort_by, order)
      .offset((p - 1) * limit)
      .limit(limit),
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
    .returning('*');
};

exports.updateArticle = (inc_votes, article_id) => {
  return knex('articles')
    .where({ article_id })
    .increment('votes', inc_votes)
    .returning('*');
};

exports.deleteArticle = (article_id) => {
  return knex('articles')
    .where('article_id', article_id)
    .delete();
};
