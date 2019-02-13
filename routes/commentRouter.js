const commentRouter = require('express').Router();
const { patchComment, removeCommentsID } = require('../controllers');
const { handle405 } = require('../errors');

commentRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(removeCommentsID)
  .all(handle405);

module.exports = commentRouter;
