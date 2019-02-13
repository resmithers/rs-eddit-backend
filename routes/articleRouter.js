const articleRouter = require('express').Router();
const {
  sendArticles,
  sendArticleByID,
  addArticle,
  patchArticle,
  removeArticle,
  removeCommentsByArticle,
  sendCommentsByArticle,
  addCommentByArticle,
} = require('../controllers');
const { handle405 } = require('../errors');

articleRouter.route('/')
  .get(sendArticles)
  .post(addArticle)
  .all(handle405);

articleRouter.route('/:article_id')
  .get(sendArticleByID)
  .patch(patchArticle)
  .delete(removeArticle)
  .all(handle405);

articleRouter.route('/:article_id/comments')
  .get(sendCommentsByArticle)
  .post(addCommentByArticle)
  .all(handle405);

module.exports = articleRouter;
