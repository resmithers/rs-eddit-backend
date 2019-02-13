const topicRouter = require('express').Router();
const { sendTopics, addTopic } = require('../controllers');
const { handle405 } = require('../errors');

topicRouter.route('/')
  .get(sendTopics)
  .post(addTopic)
  .all(handle405);

module.exports = topicRouter;
