const { getCommentsByArticle, postCommentByArticle, updateComment, deleteCommentID, fetchArticles } = require('../models');
const { formatCommentData } = require('./utils');

exports.sendCommentsByArticle = (req, res, next) => {
  getCommentsByArticle(req.query, req.params.article_id)
    .then((data) => {
      if (!data[0]) return Promise.reject({ status: 404 });
      return res.send(formatCommentData(data));
    })
    .catch(next);
};

exports.addCommentByArticle = (req, res, next) => {
  const { article_id } = req.params;
  postCommentByArticle(article_id, req.body)
    .then((data) => {
      res.status(201).send({ comments: data });
    }).catch(next);
};

exports.patchComment = (req, res, next) => {
  updateComment(req.body, req.params.comment_id)
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404 });
      if ((typeof req.body.inc_votes !== 'number' && req.body.inc_votes)) return Promise.reject({ status: 400 });
      return res.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeCommentsID = (req, res, next) => {
  deleteCommentID(req.params.comment_id)
    .then((delRows) => {
      if (!delRows) return Promise.reject({ status: 400 });
      return res.status(204).send();
    })
    .catch(next);
};
