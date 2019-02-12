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

articleRouter.route('/')
  .get(sendArticles)
  .post(addArticle);

articleRouter.route('/:article_id')
  .get(sendArticleByID)
  .patch(patchArticle)
  .delete(removeArticle);

articleRouter.route('/:article_id/comments')
  .get(sendCommentsByArticle)
  .post(addCommentByArticle)
  .delete(removeCommentsByArticle);

module.exports = articleRouter;
