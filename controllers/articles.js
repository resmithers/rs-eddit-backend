const {
  fetchArticles, insertArticle, updateArticle, deleteArticle,
} = require('../models');

const { formatArticleData } = require('./utils');

exports.sendArticles = (req, res, next) => {
  const varObj = { ...req.query, ...req.params };
  fetchArticles(varObj)
    .then((data) => {
      res.send(formatArticleData(data));
    })
    .catch(next);
};

exports.sendArticleByID = (req, res, next) => {
  const varObj = { ...req.query, ...req.params };
  fetchArticles(varObj)
    .then(([article]) => {
      if (!article[0]) return Promise.reject({ status: 404 });
      return res.send({ article: article[0] });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  // const varObj = { ...req.body, ...req.params };
  updateArticle(req.body.inc_votes, req.params.article_id)
    .then(([article]) => {
      if (!req.body.inc_votes) return Promise.reject({ status: 400, msg: 'Bad request' });
      return res.status(202).send({ article });
    })
    .catch(next);
};

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params.article_id)
    .then((delRows) => {
      if (!delRows) return Promise.reject({ status: 404 });
      return res.status(204).send();
    })
    .catch(next);
};
