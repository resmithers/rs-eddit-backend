const {
  fetchArticles, insertArticle, fetchArticleByID, updateArticle, deleteArticle,
} = require('../models');

exports.sendArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.send({ articles });
    })
    .catch(console.error);
};

exports.sendArticleByID = (req, res, next) => {
  fetchArticleByID(req.params.article_id)
    .then((articles) => {
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
  updateArticle(req.body, req.param.article_id)
    .then((article) => {
      res.send({ article });
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
