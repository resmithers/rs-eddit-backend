const topicRouter = require('express').Router();
const { sendTopics, addTopic } = require('../controllers');

topicRouter.route('/')
  .get(sendTopics)
  .post(addTopic);

module.exports = topicRouter;
