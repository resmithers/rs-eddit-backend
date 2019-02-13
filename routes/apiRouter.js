const apiRouter = require('express').Router();
const {
  articleRouter, commentRouter, topicRouter, userRouter,
} = require('./');
const { serveEndpoints } = require('../controllers');
const { handle405 } = require('../errors');

apiRouter.route('/')
  .get(serveEndpoints)
  .all(handle405);

apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;
