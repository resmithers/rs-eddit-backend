const knex = require('../db/connection');

exports.fetchArticles = () => {
  return knex('articles')
    .select('*');
};

exports.fetchArticleByID = (id) => {
  return knex('articles')
    .select('*')
    .where({ article_id: id });
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
