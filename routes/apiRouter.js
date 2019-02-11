const apiRouter = require('express').Router();
const {
  articleRouter, commentRouter, topicRouter, userRouter,
} = require('./');

apiRouter.route('/').get();
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;
