const { sendTopics, insertTopic } = require('./topics');
const {
  sendArticles, insertArticle, sendArticleByID, putArticle, removeArticle, addArticle,
} = require('./articles');


module.exports = {
  sendTopics, insertTopic, sendArticles, insertArticle, sendArticleByID, putArticle, removeArticle, addArticle,
};
