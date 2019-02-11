const { fetchTopics, insertTopic } = require('./topics');
const {
  fetchArticles, insertArticle, fetchArticleByID, updateArticle, deleteArticle,
} = require('./articles');


module.exports = {
  fetchTopics, insertTopic, fetchArticles, insertArticle, fetchArticleByID, updateArticle, deleteArticle,
};
