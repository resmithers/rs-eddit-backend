const knex = require('../db/connection');

exports.fetchArticles = ({
  limit = 10,
  page = 1,
  sort = 'desc',
  sort_criteria = 'articles.created_at',
  article_id,
  author,
  ...a
}) => {
  const remaining = { ...a };
  if (author) remaining['articles.author_id'] = author;
  if (article_id) remaining['articles.article_id'] = article_id;

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
