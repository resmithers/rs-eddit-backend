const apiRouter = require('express').Router();
const {
  articleRouter, commentRouter, topicRouter, userRouter,
} = require('./');
const { serveEndpoints } = require('../controllers');

apiRouter.route('/').get(serveEndpoints);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;
