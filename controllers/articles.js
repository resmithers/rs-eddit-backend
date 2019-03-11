const {
  fetchArticles, insertArticle, updateArticle, deleteArticle,
} = require('../models');

const { formatArticleData } = require('./utils');

exports.sendArticles = (req, res, next) => {
  const varObj = { ...req.query, ...req.params };
  console.log(req.query);
  fetchArticles(varObj)
    .then((data) => {
      if (!data[0][0]) return Promise.reject({ status: 404 });
      return res.send(formatArticleData(data));
    })
    .catch(next);
};

exports.sendArticleByID = (req, res, next) => {
  const varObj = { ...req.query, ...req.params };
  fetchArticles(varObj)
    .then(([[article]]) => {
      if (!article) return Promise.reject({ status: 400 });
      return res.send({ article });
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
  updateArticle(req.body.inc_votes, req.params.article_id)
    .then(([article]) => {
      if (typeof req.body.inc_votes !== 'number' && Object.keys(req.body).length > 0) return Promise.reject({ status: 400, msg: 'Bad request' });
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params.article_id)
    .then((delRows) => {
      if (!delRows) return Promise.reject({ status: 400 });
      return res.status(204).send();
    })
    .catch(next);
};
