const { getCommentsByArticle, deleteCommentsByArticle } = require('../models');
const { formatCommentData } = require('./utils');

exports.sendCommentsByArticle = (req, res, next) => {
  getCommentsByArticle(req.query, req.params.article_id)
    .then((data) => {
      res.send(formatCommentData(data));
    })
    .catch(console.error);
};

exports.removeCommentsByArticle = (req, res, next) => {
  deleteCommentsByArticle(req.query, req.params.article_id)
    .then(() => {
      res.status(204).send();
    });
};
