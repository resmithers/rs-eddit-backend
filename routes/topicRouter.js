const topicRouter = require('express').Router();
const { sendTopics } = require('../controllers');

topicRouter.route('/')
  .get(sendTopics);

module.exports = topicRouter;
