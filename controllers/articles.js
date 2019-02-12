const {
  fetchArticles, fetchArticleByID, insertArticle, updateArticle, deleteArticle,
} = require('../models');

const { formatArticleData } = require('./utils');

exports.sendArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((data) => {
      res.send(formatArticleData(data));
    })
    .catch(console.error);
};

exports.sendArticleByID = (req, res, next) => {
  fetchArticleByID(req.params)
    .then(([articles]) => {
      res.send({ articles });
    })
    .catch(console.error);
};

exports.addArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(console.error);
};

exports.putArticle = (req, res, next) => {
  updateArticle(req.body, req.params.article_id)
    .then(([article]) => {
      res.status(202).send({ article });
    })
    .catch(console.error);
};

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params.article_id)
    .then(() => {
      res.send({ msg: `Article ${req.params.article_id} deleted` });
    })
    .catch(console.error);
};
