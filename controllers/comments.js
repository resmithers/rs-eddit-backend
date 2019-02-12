const { getCommentsByArticle, postCommentByArticle, deleteCommentsByArticle, updateComment, deleteCommentID } = require('../models');
const { formatCommentData } = require('./utils');

exports.sendCommentsByArticle = (req, res, next) => {
  getCommentsByArticle(req.query, req.params.article_id)
    .then((data) => {
      res.send(formatCommentData(data));
    })
    .catch(console.error);
};

exports.addCommentByArticle = (req, res, next) => {
  postCommentByArticle(req.params.article_id, req.body)
    .then((data) => {
      res.status(201).send({ comments: data });
    })
    .catch(console.error);
};

exports.patchComment = (req, res, next) => {
  updateComment(req.body, req.params.comment_id)
    .then(([comment]) => {
      res.status(202).send({ comment });
    })
    .catch(console.error);
};

exports.removeCommentsByArticle = (req, res, next) => {
  deleteCommentsByArticle(req.params.article_id)
    .then(() => {
      res.status(204).send();
    });
};

exports.removeCommentsID = (req, res, next) => {
  deleteCommentID(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    });
};
