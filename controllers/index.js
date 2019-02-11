const { sendTopics, addTopic } = require('./topics');
const {
  sendArticles, insertArticle, sendArticleByID, putArticle, removeArticle, addArticle,
} = require('./articles');


module.exports = {
  sendTopics, addTopic, sendArticles, insertArticle, sendArticleByID, putArticle, removeArticle, addArticle,
};
