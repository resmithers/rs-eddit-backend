const articleRouter = require('express').Router();
const {
  sendArticles, sendArticleByID, addArticle, putArticle, removeArticle,
} = require('../controllers');

articleRouter.route('/')
  .get(sendArticles)
  .post(addArticle);

articleRouter.route('/:article_id')
  .get(sendArticleByID)
  .put(putArticle)
  .delete(removeArticle);

module.exports = articleRouter;
